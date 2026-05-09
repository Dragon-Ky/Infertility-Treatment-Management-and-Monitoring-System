<?php

namespace App\Http\Controllers\Admin;

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

    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'title' => 'required|string',
            'body' => 'required|string',
            'type' => 'required|in:appointment,reminder,system,treatment,blog',
            'data' => 'nullable|array',
            'channel' => 'required|in:firebase,email,sms'
        ]);

        $notification = $this->notificationService->createNotification($validated['user_id'], $validated);
        
        dispatch(function () use ($notification) {
            $this->notificationService->sendNotification($notification);
        });

        return response()->json($notification, 201);
    }

    public function logs(Request $request): JsonResponse
    {
        $notifications = Notification::latest()
            ->paginate(50);

        return response()->json($notifications);
    }
}
