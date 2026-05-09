<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Reminder;
use App\Models\NotificationLog;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Carbon\Carbon;

class ProcessRemindersJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // 1. Tìm tất cả các nhắc nhở đã ĐẾN GIỜ (hoặc quá giờ một chút) và CHƯA GỬI
        $reminders = Reminder::where('is_sent', false)
            ->where('remind_at', '<=', Carbon::now())
            ->get();

        $messaging = Firebase::messaging();

        // 2. Đi qua từng nhắc nhở và gửi thông báo
        foreach ($reminders as $reminder) {
            try {
                // Giả lập Token của User
                $fcmToken = "TOKEN_CUA_USER_" . $reminder->user_id; 
                
                $message = \Kreait\Firebase\Messaging\CloudMessage::withTarget('token', $fcmToken)
                    ->withNotification(\Kreait\Firebase\Messaging\Notification::create($reminder->title, $reminder->message));
                
                // Bắn thông báo
                $messaging->send($message);

                // Lưu nhật ký & Đánh dấu là đã gửi thành công để lần sau không gửi lại nữa
                NotificationLog::create(['user_id' => $reminder->user_id, 'message_body' => $reminder->message, 'status' => 'success']);
                $reminder->update(['is_sent' => true]);

            } catch (\Exception $e) {
                // Nếu lỗi Firebase thì ghi lại lịch sử thất bại
                NotificationLog::create(['user_id' => $reminder->user_id, 'message_body' => $reminder->message, 'status' => 'failed']);
            }
        }
    }
}