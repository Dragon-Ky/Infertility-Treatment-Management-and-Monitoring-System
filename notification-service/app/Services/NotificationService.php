<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\DeviceToken;
use App\Models\NotificationPreference;

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
        $preference = NotificationPreference::where('user_id', $notification->user_id)->first();
        
        if (!$this->shouldSendNotification($notification, $preference)) {
            $notification->update(['status' => 'failed']);
            return;
        }

        $deviceTokens = DeviceToken::where('user_id', $notification->user_id)
            ->where('is_active', true)
            ->pluck('token')
            ->toArray();

        if (empty($deviceTokens)) {
            $notification->update(['status' => 'failed']);
            return;
        }

        try {
            $this->firebaseService->sendToMultipleDevices($deviceTokens, [
                'title' => $notification->title,
                'body' => $notification->body,
                'data' => $notification->data ?? []
            ]);

            $notification->update([
                'status' => 'sent',
                'sent_at' => now()
            ]);
        } catch (\Exception $e) {
            $notification->update(['status' => 'failed']);
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
}