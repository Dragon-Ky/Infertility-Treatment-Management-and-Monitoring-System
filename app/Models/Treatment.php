<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'doctor_id', 
        'service_id', 
        'treatment_name', 
        'treatment_type', 
        'status', 
        'start_date', 
        'expected_end_date', 
        'actual_end_date', 
        'total_cost', 
        'paid_amount', 
        'notes'
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'treatment_id');
    }

    public function getRemainingAmountAttribute()
    {
        return $this->total_cost - $this->paid_amount;
    }
}