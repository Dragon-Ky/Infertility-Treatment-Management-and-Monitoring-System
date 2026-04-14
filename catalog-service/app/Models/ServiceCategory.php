<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    use HasFactory;

    // =========================
    // SỬA fillable để cho phép insert/update
    // =========================
    protected $fillable = [
        'name',
        'description'
    ];

    // =========================
    // thêm import Service model (QUAN TRỌNG)
    // =========================
    public function services()
    {
        return $this->hasMany(Service::class, 'service_category_id');
    }
}