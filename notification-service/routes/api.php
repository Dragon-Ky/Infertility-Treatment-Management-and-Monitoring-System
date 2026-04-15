<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\PreferenceController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;

Route::prefix('api')->middleware('auth')->group(function () {

    // User Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markReadAll']);

    // Device Tokens
    Route::post('/devices/register', [DeviceController::class, 'register']);
    Route::delete('/devices/{token}', [DeviceController::class, 'remove']);

    // Notification Preferences
    Route::get('/preferences', [PreferenceController::class, 'index']);
    Route::put('/preferences', [PreferenceController::class, 'update']);
});

Route::prefix('api/admin')->middleware(['auth', 'admin'])->group(function () {
    Route::post('/notifications/send', [AdminNotificationController::class, 'send']);
    Route::get('/notifications/logs', [AdminNotificationController::class, 'logs']);
});

require __DIR__.'/web.php';
