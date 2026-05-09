<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class NotificationController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index(Request $request): JsonResponse

    {
        $notifications = Notification::where('user_id', auth()->id())
            ->latest()
            ->paginate(20);

        return response()->json($notifications);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::where('user_id', auth()->id())
            ->where('status', '!=', 'read')
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    public function markRead(Notification $notification): JsonResponse
    {
        $notification->update([
            'status' => 'read',
            'read_at' => now()
        ]);

        return response()->json($notification);
    }

    public function markReadAll(Request $request): JsonResponse
    {
        Notification::where('user_id', auth()->id())
            ->where('status', '!=', 'read')
            ->update([
                'status' => 'read',
                'read_at' => now()
            ]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function sendEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'email' => 'required|email',
            'user_name' => 'required|string',
            'appointment_type' => 'required|string',
            'appointment_date' => 'required|string',
            'appointment_time' => 'required|string',
            'doctor_name' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $notification = $this->notificationService->createNotification($validated['user_id'], [
            'title' => 'Nhắc nhở lịch khám',
            'body' => "Bạn có lịch {$validated['appointment_type']} vào ngày {$validated['appointment_date']}",
            'type' => 'appointment',
            'channel' => 'email',
            'data' => $validated
        ]);

        // Gửi ngay lập tức
        $this->notificationService->sendNotification($notification);

        return response()->json([
            'message' => 'Email sent successfully',
            'notification' => $notification
        ]);
    }
}

