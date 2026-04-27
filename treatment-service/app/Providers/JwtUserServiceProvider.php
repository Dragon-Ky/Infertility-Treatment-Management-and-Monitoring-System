<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Authenticatable;

class JwtUserServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Auth::provider('jwt_payload', function ($app, array $config) {
            return new class implements UserProvider {
                public function retrieveById($identifier) {
                    // Trả về user ảo từ ID (thường JWT-auth sẽ gọi cái này sau khi parse token)
                    return new User(['id' => $identifier]);
                }
                public function retrieveByToken($identifier, $token) {}
                public function updateRememberToken(Authenticatable $user, $token) {}
                public function retrieveByCredentials(array $credentials) {}
                public function validateCredentials(Authenticatable $user, array $credentials) { return true; }
                public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false) {}
            };
        });
    }
}
