<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\DeviceToken;
use App\Models\NotificationPreference;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentReminder;


class NotificationService
{
    protected FirebaseService $firebaseService;

    public function __construct(FirebaseService $firebaseService)
    {
        $this->firebaseService = $firebaseService;
    }

    public function createNotification(int $userId, array $data): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $data['title'],
            'body' => $data['body'],
            'type' => $data['type'],
            'data' => $data['data'] ?? null,
            'channel' => $data['channel'] ?? 'firebase',
            'status' => 'pending'
        ]);
    }

    public function sendNotification(Notification $notification): void
    {
        // 1. Kiểm tra xem người dùng có bật cài đặt cho phép nhận thông báo không
        $preference = NotificationPreference::where('user_id', $notification->user_id)->first();

        if (!$this->shouldSendNotification($notification, $preference)) {
            $notification->update(['status' => 'failed']);
            return;
        }

        try {
            // 2. RẼ NHÁNH TƯ DUY RÕ RÀNG Ở ĐÂY:
            if ($notification->channel === 'email') {
                // Nếu mục đích là gửi Email -> Chạy thẳng hàm gửi Email, KHÔNG quan tâm điện thoại
                $this->sendEmail($notification);
            } else {
                // Nếu mục đích là gửi thông báo về App -> LÚC NÀY MỚI ĐI TÌM ĐIỆN THOẠI
                $deviceTokens = DeviceToken::where('user_id', $notification->user_id)
                    ->where('is_active', true)
                    ->pluck('token')
                    ->toArray();

                // Nếu không tìm thấy điện thoại nào đang cài app thì mới dừng việc gửi thông báo App
                if (empty($deviceTokens)) {
                    $notification->update(['status' => 'failed']);
                    return;
                }

                // Có điện thoại thì mới tiến hành gửi Firebase
                $this->sendPush($notification, $deviceTokens);
            }

            // 3. Nếu chạy mượt mà qua các bước trên thì đánh dấu là gửi thành công
            $notification->update([
                'status' => 'sent',
                'sent_at' => now()
            ]);
        } catch (\Exception $e) {
            // Nếu có lỗi mạng hoặc sai mật khẩu Gmail, nó sẽ báo lỗi ở đây
            \Log::error("Notification failed: " . $e->getMessage());
            $notification->update(['status' => 'failed']);
        }
    }
    protected function sendPush(Notification $notification, array $deviceTokens): void
    {
        $this->firebaseService->sendToMultipleDevices($deviceTokens, [
            'title' => $notification->title,
            'body' => $notification->body,
            'data' => $notification->data ?? []
        ]);
    }

    protected function sendEmail(Notification $notification): void
    {
        $data = $notification->data;
        if (!isset($data['email'])) {
            \Log::error("Email sending failed: Recipient email is missing in data.");
            throw new \Exception("Email address not found in notification data");
        }

        \Log::info("Attempting to send email to: " . $data['email']);

        try {
            Mail::to($data['email'])->send(new AppointmentReminder($data));
            \Log::info("Mail::send executed successfully for: " . $data['email']);
        } catch (\Exception $e) {
            \Log::error("SMTP Error when sending to " . $data['email'] . ": " . $e->getMessage());
            throw $e;
        }
    }


    protected function shouldSendNotification(Notification $notification, ?NotificationPreference $preference): bool
    {
        if (!$preference) {
            return true;
        }

        return match ($notification->type) {
            'appointment' => $preference->appointment_reminder,
            'reminder' => $preference->treatment_reminder,
            'system' => $preference->system_notification,
            default => true
        };
    }

    public function sendStoredNotification(int $userId, string $templateName, array $variables = []): bool
    {
        $template = \App\Models\NotificationTemplate::where('name', $templateName)->first();

        if (!$template) {
            // Fallback: If no template, we might want to log or send a generic one
            \Illuminate\Support\Facades\Log::warning("Notification template not found: {$templateName}");
            return false;
        }

        $title = $template->title;
        $body = $template->body;

        foreach ($variables as $key => $value) {
            $title = str_replace("{{$key}}", $value, $title);
            $body = str_replace("{{$key}}", $value, $body);
        }

        $notification = $this->createNotification($userId, [
            'title' => $title,
            'body' => $body,
            'type' => $template->type ?? 'system',
        ]);

        $this->sendNotification($notification);
        return true;
    }

    public function sendPushNotification(int $userId, string $templateKey, array $data = []): bool
    {
        return $this->sendStoredNotification($userId, $templateKey, $data);
    }
}