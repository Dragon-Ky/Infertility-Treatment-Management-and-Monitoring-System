<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReminderSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'treatment_id', 'reminder_type', 'scheduled_time', 'status', 'notification_id'
    ];
}