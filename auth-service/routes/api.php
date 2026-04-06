<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\Api\DoctorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\TreatmentController;

// API Routes

// --- NHÓM CÔNG KHAI (Public) ---
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

// API Blog công khai (Sẽ áp dụng Redis Cache ở đây để tăng tốc độ tải tin tức)
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// --- NHÓM BẢO MẬT (Protected by JWT) ---
Route::middleware('auth:api')->group(function () {

    // Lấy thông tin cá nhân
    Route::get('/me', [AuthController::class, 'me']);

    // Đăng xuất
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cập nhật Profile
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);

    // Đổi mật khẩu
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Lấy danh sách bác sĩ (Có Redis Cache)
    Route::get('/doctors', [UserApiController::class, 'getDoctors']);

    // --- NHÓM DÀNH RIÊNG CHO BÁC SĨ (Doctor Roles & Admin) ---
    // Chỉ những User có role 'Doctor' hoặc 'Admin' mới được gọi API này
    Route::middleware('role:Doctor|Admin')->group(function () {

        // Lấy danh sách bệnh nhân đang phụ trách (Phục vụ Doctor Dashboard)
        Route::get('/doctor/patients', [DoctorController::class, 'index']);

        // Xem chi tiết hồ sơ bệnh án của một bệnh nhân
        Route::get('/doctor/patients/{id}', [DoctorController::class, 'show']);

        // Cập nhật chỉ số xét nghiệm/phác đồ điều trị
        Route::post('/doctor/update-treatment', [DoctorController::class, 'updateTreatment']);

        // Quản lý Blog (Chỉ bác sĩ/admin mới được đăng bài)
        Route::post('/posts', [PostController::class, 'store']);
        Route::put('/posts/{id}', [PostController::class, 'update']);
        Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    });


    // --- NHÓM DÀNH RIÊNG CHO BỆNH NHÂN (Patient Roles) ---
    Route::middleware('role:Patient')->group(function () {

        // Xem lịch trình điều trị cá nhân (Monitoring)
        Route::get('/my-treatment', [TreatmentController::class, 'myProcess']);

        // Đặt lịch hẹn mới
        Route::post('/appointments', [TreatmentController::class, 'bookAppointment']);
    });

});
