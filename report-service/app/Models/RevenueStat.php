<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RevenueStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'period',
        'service_type',
        'total_revenue',
        'total_treatments',
        'successful_treatments',
        'success_rate',
    ];

    protected $casts = [
        'total_revenue' => 'decimal:2',
        'success_rate' => 'decimal:2',
    ];

    /**
     * Scope to filter by period.
     */
    public function scopeForPeriod($query, $period)
    {
        return $query->where('period', $period);
    }

    /**
     * Scope to filter by service type.
     */
    public function scopeForServiceType($query, $serviceType)
    {
        return $query->where('service_type', $serviceType);
    }

    /**
     * Get total revenue for a period.
     */
    public static function getTotalRevenueForPeriod($period)
    {
        return static::forPeriod($period)->sum('total_revenue');
    }

    /**
     * Get average success rate for a period.
     */
    public static function getAverageSuccessRate($period)
    {
        return static::forPeriod($period)->avg('success_rate');
    }
}
