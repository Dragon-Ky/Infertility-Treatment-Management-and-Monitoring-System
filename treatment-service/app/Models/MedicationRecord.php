<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicationRecord extends Model
{
    use HasFactory;

    protected $table = 'medication_records';

    protected $fillable = [
        'medication_schedule_id',
        'scheduled_time',
        'actual_time',
        'status',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'scheduled_time' => 'datetime',
        'actual_time' => 'datetime',
    ];
}