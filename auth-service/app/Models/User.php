<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * Các thuộc tính có thể gán hàng loạt (Mass Assignment)
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'status',
    ];

    /**
     * Các thuộc tính nên được ẩn đi khi trả về JSON (Bảo mật)
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Ép kiểu dữ liệu (Casting)
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status' => 'integer',
        ];
    }

    /**
     * --- CÁC HÀM TIỆN ÍCH CHECK ROLE NHANH ---
     */
    public function isAdmin() { return $this->hasRole('Admin'); }
    public function isManager() { return $this->hasRole('Manager'); }
    public function isDoctor() { return $this->hasRole('Doctor'); }
    public function isCustomer() { return $this->hasRole('Customer'); }

    /**
     * --- JWT METHODS ---
     */

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Truyền Role vào trong Token
     */
    public function getJWTCustomClaims()
    {
        // Trả về role đầu tiên của User (Admin, Manager, Doctor hoặc Customer)
        return [
            'role' => $this->getRoleNames()->first(),
        ];
    }
}
