<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreatmentSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'treatment_id',
        'schedule_date',
        'schedule_type',
        'description',
        'status',
        'reminder_sent'
    ];

    protected $casts = [
        'schedule_date' => 'date',
        'reminder_sent' => 'boolean',
    ];

    public function treatment()
    {
        return $this->belongsTo(Treatment::class);
    }
}
