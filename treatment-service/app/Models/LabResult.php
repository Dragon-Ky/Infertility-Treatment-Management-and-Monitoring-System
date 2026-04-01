<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabResult extends Model
{
    use HasFactory;

    protected $table = 'lab_results';

    protected $fillable = [
        'treatment_id',
        'test_type',
        'test_date',
        'result_data',
        'reference_range',
        'unit',
        'notes',
        'doctor_notes',
        'attachments',
    ];

    protected $casts = [
        'test_date' => 'datetime',
        'result_data' => 'array',
        'attachments' => 'array',
    ];
}