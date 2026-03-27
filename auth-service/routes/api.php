<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- NHÓM CÔNG KHAI (Public) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// --- NHÓM BẢO MẬT (Protected by JWT) ---
Route::middleware('auth:api')->group(function () {

    // Lấy thông tin cá nhân
    Route::get('/me', [AuthController::class, 'me']);

    // Đăng xuất
    Route::post('/logout', [AuthController::class, 'logout']);

    // Lấy danh sách bác sĩ (Có Redis Cache)
    Route::get('/doctors', [UserApiController::class, 'getDoctors']);

});
