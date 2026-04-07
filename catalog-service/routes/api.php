<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\ScheduleController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


//  DOCTORS
Route::apiResource('doctors', DoctorController::class);


//  SERVICES (IUI / IVF)
Route::apiResource('services', ServiceController::class);

// 🏷️ SERVICE CATEGORIES
Route::apiResource('service-categories', ServiceCategoryController::class);

// 📅 DOCTOR SCHEDULES
Route::apiResource('schedules', ScheduleController::class);