<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'appointment_reminder',
        'treatment_reminder',
        'system_notification',
        'email_notification',
        'sms_notification'
    ];

    protected $casts = [
        'appointment_reminder' => 'boolean',
        'treatment_reminder' => 'boolean',
        'system_notification' => 'boolean',
        'email_notification' => 'boolean',
        'sms_notification' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
