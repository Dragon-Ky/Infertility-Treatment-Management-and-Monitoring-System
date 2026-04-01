<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicationSchedule extends Model
{
    use HasFactory;

    protected $table = 'medication_schedules';

    protected $fillable = [
        'treatment_id',
        'medication_name',
        'dosage',
        'frequency',
        'start_date',
        'end_date',
        'time_slots',
        'route',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}