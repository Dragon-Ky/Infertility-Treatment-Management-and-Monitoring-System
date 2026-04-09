<?php
namespace App\Repositories;

use App\Repositories\Contracts\NotificationRepositoryInterface;
use App\Models\NotificationTemplate;
use App\Models\NotificationPreference;
use App\Models\NotificationLog;

class NotificationRepository implements NotificationRepositoryInterface
{
    public function getTemplate(string $key)
    {
        return NotificationTemplate::where('key', $key)->first();
    }

    public function userWantsNotification(int $userId): bool
    {
        $preference = NotificationPreference::where('user_id', $userId)->first();
        // Mặc định là cho phép nhận thông báo nếu người dùng chưa cài đặt
        return $preference ? $preference->receive_push : true; 
    }

    public function logNotification(int $userId, string $messageBody, string $status): void
    {
        NotificationLog::create([
            'user_id' => $userId,
            'message_body' => $messageBody,
            'status' => $status
        ]);
    }
}