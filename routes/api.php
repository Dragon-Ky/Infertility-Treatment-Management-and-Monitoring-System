<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\TreatmentController;

// Group cho Appointment
Route::prefix('appointments')->group(function () {
    Route::get('/', [AppointmentController::class, 'index']);      // Xem danh sách
    Route::post('/', [AppointmentController::class, 'store']);     // Thêm mới/Chọn bác sĩ
    Route::put('/{id}', [AppointmentController::class, 'update']); // Sửa lịch
    Route::delete('/{id}', [AppointmentController::class, 'destroy']); // Xóa lịch
});

// Group cho Treatment
Route::prefix('treatments')->group(function () {
    Route::post('/register', [TreatmentController::class, 'register']); // Đăng ký đợt điều trị
    Route::get('/{id}', [TreatmentController::class, 'show']);          // Xem lịch trình
    Route::patch('/{id}/status', [TreatmentController::class, 'updateStatus']); // Cập nhật trạng thái
});