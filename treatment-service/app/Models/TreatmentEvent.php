<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TreatmentEvent extends Model {
    protected $table = 'treatment_events';
    protected $fillable = ['treatment_id', 'event_type', 'event_date', 'description', 'result', 'doctor_notes', 'attachments'];
    protected $casts = [
        'event_date' => 'datetime',
        'attachments' => 'array', // Tự dịch JSON thành mảng
    ];
}