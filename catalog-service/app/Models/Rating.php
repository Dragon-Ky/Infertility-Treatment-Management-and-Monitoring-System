<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'user_id',
        'appointment_id',
        'rating',
        'feedback',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }
}