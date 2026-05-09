<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecimenRecord extends Model
{
    protected $table = 'specimen_records';

    protected $fillable = [
        'treatment_id',
        'type',
        'specimen_code',
        'fertilization_date',
        'development_day',
        'grade',
        'status',
        'notes',
        'is_active'
    ];

    protected $casts = [
        'is_active'          => 'boolean',
        'fertilization_date' => 'date',
        'development_day'    => 'string',
        'created_at'         => 'datetime',
        'updated_at'         => 'datetime',
    ];

    public function treatmentProtocol()
    {
        return $this->belongsTo(TreatmentProtocol::class, 'treatment_id', 'id');
    }
}
