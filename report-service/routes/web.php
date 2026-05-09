<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

// CƯỠNG ÉP ROUTE ADMIN VÀO ĐÂY ĐỂ TRÁNH LỖI 404 DO TIỀN TỐ API
Route::get('/api/admin/sync-status', [AdminController::class, 'syncStatus']);
Route::post('/api/admin/sync/trigger', [AdminController::class, 'triggerSync']);
