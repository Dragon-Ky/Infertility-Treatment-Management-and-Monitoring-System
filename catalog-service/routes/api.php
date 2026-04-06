<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\DoctorScheduleController;

Route::apiResource('doctor-schedules', DoctorScheduleController::class);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResource('service-categories', ServiceCategoryController::class);
Route::apiResource('doctors', DoctorController::class);
Route::apiResource('services', ServiceController::class);
