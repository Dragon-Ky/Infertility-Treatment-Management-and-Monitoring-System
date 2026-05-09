<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

// --- PUBLIC DASHBOARD ROUTES ---
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/dashboard/overview', [DashboardController::class, 'overview']);

// Route nội bộ
Route::any('/clear-dashboard-cache', function () {
    \Illuminate\Support\Facades\Cache::flush();
    return response()->json(['success' => true, 'message' => 'Cache cleared successfully']);
});

Route::get('/reports/{id}/download', [ReportController::class, 'download']);


// --- PROTECTED ROUTES ---
Route::middleware('role:Customer,Manager,Admin')->group(function () {
    Route::get('/reports/treatment-success', [ReportController::class, 'treatmentSuccess']);
    Route::get('/reports/revenue', [ReportController::class, 'revenue']);
    Route::get('/reports/patients', [ReportController::class, 'patients']);
    Route::get('/reports/doctors', [ReportController::class, 'doctors']);
    Route::get('/reports/monthly/{month}', [ReportController::class, 'monthly']);
    Route::get('/reports/yearly/{year}', [ReportController::class, 'yearly']);
    Route::post('/reports/generate', [ReportController::class, 'generate']);

    // Admin Sync Routes (Also registered in web.php for redundancy)
    Route::middleware('role:Admin,Manager')->group(function () {
        Route::get('/admin/sync-status', [AdminController::class, 'syncStatus']);
        Route::post('/admin/sync/trigger', [AdminController::class, 'triggerSync']);
    });
});
