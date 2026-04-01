<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreatmentStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'period',
        'treatment_type',
        'total_cases',
        'completed',
        'in_progress',
        'cancelled',
        'success_rate',
    ];

    protected $casts = [
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
     * Scope to filter by treatment type.
     */
    public function scopeForTreatmentType($query, $treatmentType)
    {
        return $query->where('treatment_type', $treatmentType);
    }

    /**
     * Get total cases for a period.
     */
    public static function getTotalCasesForPeriod($period)
    {
        return static::forPeriod($period)->sum('total_cases');
    }

    /**
     * Get average success rate for a period.
     */
    public static function getAverageSuccessRate($period)
    {
        return static::forPeriod($period)->avg('success_rate');
    }

    /**
     * Get completion rate.
     */
    public function getCompletionRateAttribute(): float
    {
        if ($this->total_cases == 0) {
            return 0;
        }
        return round(($this->completed / $this->total_cases) * 100, 2);
    }
}
