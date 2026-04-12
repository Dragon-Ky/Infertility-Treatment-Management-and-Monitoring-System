<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

use App\Models\DeviceToken; 

// 1. Group các API thông báo
Route::prefix('notifications')->group(function () {
    Route::get('/user/{userId}', [NotificationController::class, 'index']); 
    Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
});

// 2. API Đăng ký Token thiết bị
Route::post('/devices/register', function (Request $request) {
    DeviceToken::updateOrCreate(
        ['user_id' => $request->user_id, 'token' => $request->token],
        ['platform' => $request->platform, 'is_active' => true]
    );
    
    return response()->json([
        'status' => 'success',
        'message' => 'Đăng ký thiết bị thành công!'
    ]);
});