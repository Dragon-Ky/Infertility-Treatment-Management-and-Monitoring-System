<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReminderSchedule extends Model
{
    protected $fillable = [
        'user_id',
        'treatment_id',
        'reminder_type',
        'scheduled_time',
        'status',
        'notification_id'
    ];

    protected $casts = [
        'scheduled_time' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function notification(): BelongsTo
    {
        return $this->belongsTo(Notification::class);
    }
}
