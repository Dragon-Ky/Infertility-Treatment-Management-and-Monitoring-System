<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Chỉ trả về view 'welcome' nếu đường dẫn KHÔNG bắt đầu bằng 'api'
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');
