<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportCache extends Model
{
    use HasFactory;

    protected $fillable = [
        'cache_key',
        'data',
        'expires_at',
    ];

    protected $casts = [
        'data' => 'array',
        'expires_at' => 'datetime',
    ];

    /**
     * Check if cache is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Get cache by key.
     */
    public static function getByKey(string $key)
    {
        $cache = static::where('cache_key', $key)->first();

        if ($cache && !$cache->isExpired()) {
            return $cache->data;
        }

        return null;
    }

    /**
     * Set cache by key.
     */
    public static function setByKey(string $key, array $data, int $ttlMinutes = 15)
    {
        return static::updateOrCreate(
            ['cache_key' => $key],
            [
                'data' => $data,
                'expires_at' => now()->addMinutes($ttlMinutes),
            ]
        );
    }

    /**
     * Clear expired cache.
     */
    public static function clearExpired()
    {
        return static::where('expires_at', '<', now())->delete();
    }
}
