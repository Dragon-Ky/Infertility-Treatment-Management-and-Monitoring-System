<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model {
    use HasFactory;

    protected $fillable = [
        'treatment_id',    // Khóa ngoại liên kết với bảng Treatment
        'user_id', 
        'doctor_id', 
        'appointment_date', 
        'appointment_time', 
        'type',            
        'status',          
        'notes'            
    ];

    // Quan hệ ngược lại: Một lịch hẹn thuộc về một phác đồ
    public function treatment() {
        return $this->belongsTo(Treatment::class);
    }
}