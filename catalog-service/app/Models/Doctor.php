<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'avatar',
        'specialization',
        'degree',
        'experience_years',
        'bio',
        'education',
        'certifications',
        'rating_avg',
        'rating_count',
        'consultation_fee',
        'status'
    ];

    public function schedules()
    {
        return $this->hasMany(DoctorSchedule::class);
    }

    
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}