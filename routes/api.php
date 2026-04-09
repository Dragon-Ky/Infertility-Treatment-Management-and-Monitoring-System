<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\TreatmentController;

Route::prefix('appointments')->group(function () {
    Route::get('/', [AppointmentController::class, 'index']);
    Route::post('/', [AppointmentController::class, 'store']);
    Route::put('/{id}', [AppointmentController::class, 'update']);
    Route::delete('/{id}', [AppointmentController::class, 'destroy']);
});

Route::prefix('treatments')->group(function () {
    Route::post('/register', [TreatmentController::class, 'register']);
    Route::get('/{id}', [TreatmentController::class, 'show']);
    Route::patch('/{id}/status', [TreatmentController::class, 'updateStatus']);
    Route::get('/{id}/reminders', [TreatmentController::class, 'getReminders']);
});

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'Service Appointment & Treatment is running',
        'timestamp' => now()->toDateTimeString(),
        'timezone' => config('app.timezone')
    ]);
});