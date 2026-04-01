<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PregnancyTracking extends Model
{
    use HasFactory;

    protected $table = 'pregnancy_tracking';

    protected $fillable = [
        'treatment_id',
        'tracking_date',
        'week_number',
        'status',
        'notes',
    ];

    protected $casts = [
        'tracking_date' => 'date',
        'week_number' => 'integer',
    ];
}