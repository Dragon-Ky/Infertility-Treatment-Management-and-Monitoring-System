<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'treatment_id',
        'user_id',
        'doctor_id',
        'appointment_date',
        'appointment_time',
        'type',
        'status',
        'notes'
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'datetime:H:i',
    ];

    public function treatment()
    {
        return $this->belongsTo(Treatment::class);
    }
}
