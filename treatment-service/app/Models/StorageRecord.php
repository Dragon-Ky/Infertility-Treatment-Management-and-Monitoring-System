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
        'item_type',
        'start_date',
        'expiry_date',
        'status',
        'location_code',
        'is_active',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'start_date'  => 'date',
        'expiry_date' => 'date',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];
    public function item()
    {
        // Mối quan hệ đa hình: item_id sẽ tự hiểu trỏ đi đâu dựa vào storage_type/item_type
        return $this->morphTo();
    }

    public function treatmentProtocol()
    {
        return $this->belongsTo(TreatmentProtocol::class, 'treatment_id', 'id');
    }
}