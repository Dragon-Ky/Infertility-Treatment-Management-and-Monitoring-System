<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TreatmentProtocolController;
use App\Http\Controllers\Api\TreatmentEventController;
use App\Http\Controllers\Api\SpecimenRecordController;
use App\Http\Controllers\Api\LabResultController;
use App\Http\Controllers\Api\MedicationScheduleController;
use App\Http\Controllers\Api\MedicationRecordController;
use App\Http\Controllers\Api\PregnancyTrackingController;
use App\Http\Controllers\Api\StorageRecordController;
use App\Http\Controllers\Api\DashboardController;


//API Routes - Treatment Service

Route::prefix('v1/treatment')->middleware(['internal.secret', 'auth:api'])->group(function () {
    // Dashboard Stats
    Route::get('dashboard/summary', [DashboardController::class, 'getDoctorDashboard']);


    // 1. Quản lý Phác đồ (Protocols)
    Route::apiResource('protocols', TreatmentProtocolController::class);

    // 2. Nhật ký sự kiện (Timeline Events)
    Route::apiResource('events', TreatmentEventController::class);

    // 3. Hồ sơ Mẫu vật chung (Phôi, Trứng, Tinh Trùng)
    Route::apiResource('specimens', SpecimenRecordController::class);

    // 4. Kết quả xét nghiệm (Lab Results)
    Route::apiResource('lab-results', LabResultController::class);

    // 5. Lịch dùng thuốc (Schedules)
    Route::apiResource('schedules', MedicationScheduleController::class);

    // 6. Xác nhận dùng thuốc (Medication Records)
    Route::apiResource('medication-records', MedicationRecordController::class);

    // 7. Theo dõi thai kỳ (Pregnancy Tracking)
    Route::apiResource('pregnancy-trackings', PregnancyTrackingController::class);

    // 8. Lưu trữ mẫu (Storage)
    Route::apiResource('storage', StorageRecordController::class);

});