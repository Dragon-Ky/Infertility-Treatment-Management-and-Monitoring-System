<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Treatment extends Model {
    protected $fillable = ['user_id', 'doctor_id', 'treatment_type', 'status', 'start_date', 'expected_end_date', 'total_cost', 'notes'];
}