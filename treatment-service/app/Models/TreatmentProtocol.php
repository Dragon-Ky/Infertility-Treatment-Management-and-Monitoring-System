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
        'doctor_id',
        'protocol_name',
        'diagnosis',
        'prescription',
        'notes',
    ];
}