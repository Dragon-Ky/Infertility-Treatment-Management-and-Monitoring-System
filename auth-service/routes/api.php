<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\Api\DoctorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\TreatmentController;
use App\Http\Controllers\Api\ManagerController;

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

    // --- 1.NHÓM TỐI CAO (Chỉ Admin) ---
    // Admin quản lý các Manager và cấu hình hệ thống toàn cục
    Route::middleware('role:Admin')->group(function () {
        Route::get('/admin/managers', [UserApiController::class, 'getManagers']); // Lấy danh sách Manager
        // Các route quản lý Manager khác...
    });

    // --- 2.NHÓM QUẢN LÝ (Admin & Manager) ---
    // Manager quản lý Doctor. Admin cũng có quyền vào xem/quản lý.
    Route::middleware('role:Admin|Manager')->group(function () {
        Route::get('/manager/doctors', [ManagerController::class, 'getDoctors']);
        // Route thêm/sửa/xóa Doctor (nếu có)...
    });

    // --- 3.NHÓM DÀNH CHO CHUYÊN MÔN (Admin & Manager & Doctor ) ---
    // Chỉ những User có role 'Doctor' hoặc 'Admin' mới được gọi API này
    Route::middleware('role:Admin|Manager|Doctor')->group(function () {

        // Lấy danh sách khách hàng đang phụ trách (Phục vụ Doctor Dashboard)
        Route::get('/doctor/customers', [DoctorController::class, 'index']);

        // Xem chi tiết hồ sơ bệnh án của một khách hàng
        Route::get('/doctor/customers/{id}', [DoctorController::class, 'show']);

        // Cập nhật chỉ số xét nghiệm/phác đồ điều trị
        Route::post('/doctor/update-treatment', [DoctorController::class, 'updateTreatment']);

        // Quản lý Blog (Chỉ Admin/Manager/Doctor mới được đăng bài)
        Route::post('/posts', [PostController::class, 'store']);
        Route::put('/posts/{id}', [PostController::class, 'update']);
        Route::delete('/posts/{id}', [PostController::class, 'destroy']);
    });


    // --- NHÓM DÀNH RIÊNG CHO KHÁCH HÀNG (Customer Roles) ---
    Route::middleware('role:Customer')->group(function () {

        // Xem lịch trình điều trị cá nhân (Monitoring)
        Route::get('/my-treatment', [TreatmentController::class, 'myProcess']);

        // Đặt lịch hẹn mới
        Route::post('/appointments', [TreatmentController::class, 'bookAppointment']);
    });

});
