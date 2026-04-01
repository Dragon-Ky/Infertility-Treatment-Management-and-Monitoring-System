<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'parameters',
        'generated_by',
        'file_path',
        'status',
    ];

    protected $casts = [
        'parameters' => 'array',
    ];

    /**
     * Scope to filter by type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter by status.
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Check if report is ready.
     */
    public function isReady(): bool
    {
        return $this->status === 'ready';
    }

    /**
     * Check if report is generating.
     */
    public function isGenerating(): bool
    {
        return $this->status === 'generating';
    }

    /**
     * Check if report failed.
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }
}
