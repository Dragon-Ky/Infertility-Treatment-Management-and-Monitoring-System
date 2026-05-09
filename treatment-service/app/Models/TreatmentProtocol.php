<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreatmentProtocol extends Model
{
    use HasFactory;

    protected $table = 'treatment_protocols';

    protected $fillable = [
        'treatment_id',
        'protocol_code',
        'doctor_id',
        'protocol_name',
        'diagnosis',
        'prescription',
        'notes',
        'status',
        'is_active',
        'price',
    ];
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function medicationSchedules()
    {
        return $this->hasMany(MedicationSchedule::class, 'treatment_id', 'id');
    }

    public function storageRecords()
    {
        return $this->hasMany(StorageRecord::class, 'treatment_id', 'id');
    }

    public function embryoRecords()
    {
        return $this->hasMany(EmbryoRecord::class, 'treatment_id', 'id');
    }

    public function treatmentEvents()
    {
        return $this->hasMany(TreatmentEvent::class, 'treatment_id', 'id');
    }

    public function labResults()
    {
        return $this->hasMany(LabResult::class, 'treatment_id', 'id');
    }

    public function pregnancyTrackings()
    {
        return $this->hasMany(PregnancyTracking::class, 'treatment_id', 'id');
    }
}
