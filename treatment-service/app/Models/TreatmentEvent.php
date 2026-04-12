<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TreatmentEvent extends Model {
    protected $table = 'treatment_events';
    protected $fillable = [
        'treatment_id',
         'event_type', 
         'event_date', 
         'description', 
         'result', 
         'doctor_notes', 
         'attachments',
         'is_active',
         ];
    protected $casts = [
        'event_date' => 'datetime',
        'attachments' => 'array', // Tự dịch JSON thành mảng
        'is_active' => 'boolean',
    ];

    public function treatmentProtocol()
    {
        return $this->belongsTo(TreatmentProtocol::class, 'treatment_id', 'id');
    }
}