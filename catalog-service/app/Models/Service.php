<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; 

class Service extends Model
{
    use HasFactory, SoftDeletes; 

    protected $fillable = [
        'name',
        'service_category_id',
        'price',
        'description'
    ];

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function pricings()
    {
        return $this->hasMany(ServicePricing::class);
    }
}