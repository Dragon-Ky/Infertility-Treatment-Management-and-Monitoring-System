<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;

    // 1. Trang chủ và xem Blog (Ai cũng xem được, kể cả Guest)
    Route::get('/', function () { return view('welcome'); });
    Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');

    // 2. Nhóm các trang yêu cầu phải Đăng nhập (Auth)
    Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () { return view('dashboard'); })->name('dashboard');

    // Quản lý Profile (Mặc định của Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Chỉ Admin mới được vào Quản lý User
    Route::middleware(['role:Admin'])->group(function () {
        Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
        Route::post('/admin/users/{user}/role', [UserController::class, 'updateRole'])->name('admin.updateRole');
    });

    // Chỉ Admin và Doctor mới được đăng bài Blog
    Route::middleware(['role:Admin|Doctor'])->group(function () {
        Route::get('/blog/create', [BlogController::class, 'create'])->name('blog.create');
        Route::post('/blog', [BlogController::class, 'store'])->name('blog.store');
    });
});

require __DIR__.'/auth.php';
