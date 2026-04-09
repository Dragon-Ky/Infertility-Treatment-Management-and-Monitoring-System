<?php

namespace App\Services;
use App\Models\Notification;
use App\Models\NotificationTemplate;
use App\Models\DeviceToken;
use App\Models\NotificationPreference;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Gửi thông báo dựa trên Template
     */
    public function sendStoredNotification($userId, $templateName, $data = [])
    {
        // 1. Kiểm tra cài đặt của User (Preference)
        $prefs = NotificationPreference::where('user_id', $userId)->first();
        if ($prefs && !$prefs->appointment_reminder) {
            return ['status' => 'skipped', 'message' => 'Người dùng tắt nhận thông báo này.'];
        }

        // 2. Lấy Template
        $template = NotificationTemplate::where('name', $templateName)->first();
        if (!$template) return ['status' => 'error', 'message' => 'Không tìm thấy mẫu tin.'];

        // 3. Render nội dung (Thay thế biến [name] -> "Khải")
        $body = $template->body_template;
        foreach ($data as $key => $value) {
            $body = str_replace("[$key]", $value, $body);
        }

        // 4. Lưu vào bảng notifications (Trạng thái pending)
        $notification = Notification::create([
            'user_id' => $userId,
            'title'   => $template->title_template,
            'body'    => $body,
            'type'    => $template->type,
            'channel' => 'firebase',
            'status'  => 'pending'
        ]);

        // 5. Lấy Token thật từ bảng device_tokens
        $device = DeviceToken::where('user_id', $userId)->where('is_active', true)->first();
        
        if ($device) {
            // Khúc này sau này gọi Firebase thật nè
            $notification->update(['status' => 'sent', 'sent_at' => now()]);
            return ['status' => 'success', 'id' => $notification->id];
        }

        $notification->update(['status' => 'failed']);
        return ['status' => 'failed', 'message' => 'Không tìm thấy Token thiết bị.'];
    }
}