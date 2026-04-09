<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\TreatmentController;
use Illuminate\Support\Facades\Route;

// Quản lý lịch hẹn
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::get('/appointments/{id}', [AppointmentController::class, 'show']);

// Quản lý điều trị
Route::post('/treatments/register', [TreatmentController::class, 'register']);
Route::get('/treatments/{id}/schedule', [TreatmentController::class, 'viewSchedule']);