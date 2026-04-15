<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
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
}
