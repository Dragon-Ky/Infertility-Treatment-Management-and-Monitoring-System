<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationPreference extends Model
{
    use HasFactory;

    // Cập nhật lại cho đúng với cột của v2 thay vì receive_push cũ
    protected $fillable = [
        'user_id', 'appointment_reminder', 'treatment_reminder', 
        'system_notification', 'email_notification', 'sms_notification'
    ]; 
}