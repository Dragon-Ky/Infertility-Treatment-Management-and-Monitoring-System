<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'body', 'type', 'data', 'channel', 'status', 'sent_at', 'read_at'
    ];
    
    protected $casts = ['data' => 'array'];
}