<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DoctorController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ServicePricingController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\BlogCategoryController;
use App\Http\Controllers\BlogController;

// AUTH USER (Sanctum)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


// =========================
//  DOCTORS
// =========================
Route::apiResource('doctors', DoctorController::class);


// =========================
//  SERVICES (IUI / IVF)
// =========================
Route::apiResource('services', ServiceController::class);


// =========================
//  SERVICE CATEGORIES
// =========================
Route::apiResource('service-categories', ServiceCategoryController::class);


// =========================
//  DOCTOR SCHEDULES
// =========================
Route::apiResource('schedules', ScheduleController::class);


// =========================
//  SERVICE PRICINGS (NEW MODULE)
// =========================


Route::get('/services/{id}/pricings', [ServicePricingController::class, 'getByService']);


Route::post('/pricings', [ServicePricingController::class, 'store']);


Route::put('/pricings/{id}', [ServicePricingController::class, 'update']);


Route::delete('/pricings/{id}', [ServicePricingController::class, 'destroy']);

// =========================
//  RATINGS
// =========================
Route::get('/doctors/{doctorId}/ratings', [RatingController::class, 'getByDoctor']);
Route::post('/ratings', [RatingController::class, 'store']);
Route::put('/ratings/{id}', [RatingController::class, 'update']);
Route::delete('/ratings/{id}', [RatingController::class, 'destroy']);

// =========================
//  BLOG CATEGORIES
// =========================
Route::apiResource('blog-categories', BlogCategoryController::class);

// =========================
//  BLOGS
// =========================
Route::get('/blogs/published', [BlogController::class, 'published']);
Route::apiResource('blogs', BlogController::class);