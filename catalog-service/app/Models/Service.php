<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    // Cho phép fillable
    protected $fillable = ['service_category_id','price','description'];

    // Quan hệ với ServiceCategory
    public function category() {
        return $this->belongsTo(ServiceCategory::class);
    }
}