<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model {
    protected $fillable = ['treatment_id', 'user_id', 'doctor_id', 'appointment_date', 'appointment_time', 'type', 'status', 'treatment_type', 'start_date', 'schedule_date', 'description'];
}
