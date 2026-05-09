<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Cấp mọi quyền cho Admin tối cao (Super Admin)
    Gate::before(function ($user, $ability) {
        return $user->hasRole('Admin') ? true : null;
    });
    }
}
