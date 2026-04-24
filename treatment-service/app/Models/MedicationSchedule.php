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
        'is_active',
    ];

    protected $attributes = [
        'status' => 'active',
        'is_active' => true,
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'time_slots' => 'array', // Để lưu danh sách giờ uống thuốc dưới dạng JSON
    ];

    public function medicationRecords()
    {
        // "Một lịch trình thuốc sẽ có nhiều lần uống (bản ghi) thuốc"
        return $this->hasMany(MedicationRecord::class, 'medication_schedule_id', 'id');
    }

    public function treatmentProtocol()
    {
        return $this->belongsTo(TreatmentProtocol::class, 'treatment_id', 'id');
    }
}
