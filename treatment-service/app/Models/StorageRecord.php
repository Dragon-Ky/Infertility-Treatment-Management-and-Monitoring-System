<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StorageRecord extends Model
{
    use HasFactory;

    protected $table = 'storage_records';

    protected $fillable = [
        'treatment_id',
        'storage_type',
        'item_id',
        'start_date',
        'expiry_date',
        'status',
        'location_code',
    ];

    protected $casts = [
        'start_date'  => 'date',
        'expiry_date' => 'date',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];
}