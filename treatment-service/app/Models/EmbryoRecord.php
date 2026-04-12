<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmbryoRecord extends Model
{
    use HasFactory;

    protected $table = 'embryo_records';

    protected $fillable = [
        'treatment_id',
        'embryo_code',
        'fertilization_date',
        'development_day',
        'grade',
        'status',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active'          => 'boolean',
        'fertilization_date' => 'date',
        'development_day'    => 'integer',
        'created_at'         => 'datetime',
        'updated_at'         => 'datetime',
    ];
    public function storage()
    {
        // "Tôi là phôi, tôi có một bản ghi lưu trữ tương ứng"
        return $this->morphOne(StorageRecord::class, 'item');
    }

    public function treatmentProtocol()
    {
        return $this->belongsTo(TreatmentProtocol::class, 'treatment_id', 'id');
    }
}