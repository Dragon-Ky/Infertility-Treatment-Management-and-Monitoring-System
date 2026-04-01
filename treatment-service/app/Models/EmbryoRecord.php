<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmbryoRecord extends Model
{
    use HasFactory;

    protected $table = 'embryo_records';

    protected $fillable = [
        'treatment_id',
        'embryo_code',
        'fertilization_date',
        'development_day',
        'grade',
        'status',
        'notes',
    ];

    protected $casts = [
        'fertilization_date' => 'date',
        'development_day' => 'integer',
    ];
}