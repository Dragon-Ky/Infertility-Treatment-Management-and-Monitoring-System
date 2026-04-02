<?php

namespace App\Services;

use App\Models\ReportCache;
use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Remember data in cache.
     */
    public function remember(string $key, callable $callback, int $ttlMinutes = 15)
    {
        // Try Redis cache first
        $redisData = Cache::store('redis')->get($key);
        if ($redisData !== null) {
            return $redisData;
        }

        // Try database cache
        $dbData = ReportCache::getByKey($key);
        if ($dbData !== null) {
            // Store in Redis for faster access
            Cache::store('redis')->put($key, $dbData, now()->addMinutes($ttlMinutes));
            return $dbData;
        }

        // Generate new data
        $data = $callback();

        // Store in both Redis and database
        Cache::store('redis')->put($key, $data, now()->addMinutes($ttlMinutes));
        ReportCache::setByKey($key, $data, $ttlMinutes);

        return $data;
    }

    /**
     * Forget cache by key.
     */
    public function forget(string $key): void
    {
        Cache::store('redis')->forget($key);
        ReportCache::where('cache_key', $key)->delete();
    }

    /**
     * Clear all cache.
     */
    public function clear(): void
    {
        Cache::store('redis')->flush();
        ReportCache::truncate();
    }

    /**
     * Clear expired cache.
     */
    public function clearExpired(): void
    {
        ReportCache::clearExpired();
    }
}
