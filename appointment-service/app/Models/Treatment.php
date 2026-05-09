<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_id',
        'doctor_id',
        'treatment_type',
        'status',
        'start_date',
        'expected_end_date',
        'notes'
    ];

    protected $casts = [
        'start_date' => 'date',
        'expected_end_date' => 'date',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'treatment_id');
    }
}
