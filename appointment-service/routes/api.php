<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TreatmentController;
use App\Http\Controllers\AppointmentController;

Route::middleware(['internal.secret', 'auth:api'])->group(function () {
    // Treatment Routes
    Route::prefix('treatments')->group(function () {
        Route::get('/', [TreatmentController::class, 'allTreatments'])->name('treatments.all');
        Route::get('/{id}', [TreatmentController::class, 'show'])->name('treatments.show');
        Route::post('/', [TreatmentController::class, 'register'])->name('treatments.register');
        Route::put('/{id}/status', [TreatmentController::class, 'updateStatus'])->name('treatments.status');
        Route::get('/{id}/reminders', [TreatmentController::class, 'getReminders'])->name('treatments.reminders');
        // API Nội bộ (Dùng cho API Gateway)
        Route::get('/internal/bulk', [TreatmentController::class, 'getTreatmentsByIds']);
    });

    // Appointment Routes
    Route::prefix('appointments')->group(function () {
        Route::get('/', [AppointmentController::class, 'index'])->name('appointments.index');
        Route::post('/', [AppointmentController::class, 'store'])->name('appointments.store');
        Route::put('/{id}', [AppointmentController::class, 'update'])->name('appointments.update');
        Route::delete('/{id}', [AppointmentController::class, 'destroy'])->name('appointments.delete');
        Route::get('/all', [AppointmentController::class, 'allAppointments'])->name('appointments.all');
    });
});
