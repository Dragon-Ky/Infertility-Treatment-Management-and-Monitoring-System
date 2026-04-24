<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Appointment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Services\RabbitMQService;

class SendAppointmentReminders extends Command
{
    // Tên lệnh để chạy: php artisan appointments:remind
    protected $signature = 'appointments:remind';

    protected $description = 'Quét và gửi thông báo Firebase nhắc lịch khám trước 60 phút';

    public function handle(RabbitMQService $rabbitmq)
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
            ->where('status', 'scheduled')
            ->get();

        if ($upcoming->isEmpty()) {
            $this->info('Không có lịch hẹn nào cần nhắc trong khung giờ này.');
            return;
        }

        foreach ($upcoming as $app) {
            // Gửi qua RabbitMQ để NotificationService xử lý (Centralized & v1 API)
            $rabbitmq->publish('notification_queue', [
                'userId' => $app->user_id,
                'templateName' => 'APPOINTMENT_REMINDER',
                'variables' => [
                    'type' => $app->type,
                    'time' => $app->appointment_time
                ]
            ]);
            $this->info("Đã đẩy nhắc nhở cho User ID: {$app->user_id} vào hàng đợi.");
        }

        $this->info('Hoàn tất tiến trình nhắc nhở.');
    }

    // Đã chuyển sang xử lý tập trung tại NotificationService qua RabbitMQ
    // private function sendFirebaseNotification($token, $app) { ... }
}