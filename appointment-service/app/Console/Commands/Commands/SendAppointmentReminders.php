<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Appointment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SendAppointmentReminders extends Command
{
    // Tên lệnh để chạy: php artisan appointments:remind
    protected $signature = 'appointments:remind';

    protected $description = 'Quét và gửi thông báo Firebase nhắc lịch khám trước 60 phút';

    public function handle()
    {
        $this->info('Đang bắt đầu quét lịch hẹn để nhắc nhở...');

        // 1. Lấy các lịch hẹn trong vòng 60 phút tới
        $now = now();
        $upcomingTime = now()->addMinutes(60);

        $upcoming = Appointment::where('appointment_date', $now->toDateString())
            ->whereBetween('appointment_time', [
                $now->toTimeString(), 
                $upcomingTime->toTimeString()
            ])
            ->where('status', 'scheduled') // Chỉ nhắc các lịch chưa hoàn thành/hủy
            ->get();

        if ($upcoming->isEmpty()) {
            $this->info('Không có lịch hẹn nào cần nhắc trong khung giờ này.');
            return;
        }

        foreach ($upcoming as $app) {
            // 2. Lấy FCM Token của User từ Cache hoặc Database
            $userToken = Cache::get("user_fcm_token_{$app->user_id}");

            if ($userToken) {
                $this->sendFirebaseNotification($userToken, $app);
                $this->info("Đã gửi nhắc nhở cho User ID: {$app->user_id}");
            } else {
                Log::warning("Không tìm thấy FCM Token cho User ID: {$app->user_id}");
            }
        }

        $this->info('Hoàn tất tiến trình nhắc nhở.');
    }

    private function sendFirebaseNotification($token, $app)
    {
        try {
            Http::withHeaders([
                'Authorization' => 'Bearer ' . env('FIREBASE_SERVER_KEY'),
                'Content-Type'  => 'application/json',
            ])->post('https://fcm.googleapis.com/fcm/send', [
                'to' => $token,
                'notification' => [
                    'title' => '🔔 NHẮC LỊCH KHÁM',
                    'body'  => "Bạn có lịch hẹn {$app->type} vào lúc {$app->appointment_time}. Đừng quên nhé!",
                    'sound' => 'default'
                ],
                'data' => [
                    'appointment_id' => $app->id,
                    'click_action' => 'FLUTTER_NOTIFICATION_CLICK'
                ]
            ]);
        } catch (\Exception $e) {
            Log::error("Lỗi gửi Firebase: " . $e->getMessage());
        }
    }
}