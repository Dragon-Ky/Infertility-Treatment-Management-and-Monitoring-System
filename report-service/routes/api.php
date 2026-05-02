<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

// API Routes

// --- PUBLIC DASHBOARD ROUTES ---
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/dashboard/overview', [DashboardController::class, 'overview']);

// Route nội bộ để các Service khác gọi qua yêu cầu xóa Cache
Route::any('/clear-dashboard-cache', function () {
    // Dùng cái này bén hơn Artisan::call nhiều, dọn sạch sành sanh Redis/File
    \Illuminate\Support\Facades\Cache::flush();
    return response()->json(['success' => true, 'message' => 'Cache cleared successfully']);
});

// --- PROTECTED ROUTES (JWT Authentication) ---
Route::middleware('auth:sanctum')->group(function () {

    // --- REPORT ROUTES ---
    Route::get('/reports/treatment-success', [ReportController::class, 'treatmentSuccess']);
    Route::get('/reports/revenue', [ReportController::class, 'revenue']);
    Route::get('/reports/patients', [ReportController::class, 'patients']);
    Route::get('/reports/doctors', [ReportController::class, 'doctors']);
    Route::get('/reports/monthly/{month}', [ReportController::class, 'monthly']);
    Route::get('/reports/yearly/{year}', [ReportController::class, 'yearly']);
    Route::post('/reports/generate', [ReportController::class, 'generate']);
    Route::get('/reports/{id}/download', [ReportController::class, 'download']);

    // --- ADMIN ROUTES ---
    Route::middleware('role:Admin|Manager')->group(function () {
        Route::get('/admin/sync-status', [AdminController::class, 'syncStatus']);
        Route::post('/admin/sync/trigger', [AdminController::class, 'triggerSync']);
    });
});
