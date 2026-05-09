<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    /**
     * Remember data in cache.
     */
    public function remember(string $key, callable $callback, int $ttlMinutes = 15)
    {
        return Cache::remember($key, now()->addMinutes($ttlMinutes), $callback);
    }

    /**
     * Forget cache by key.
     */
    public function forget(string $key): void
    {
        Cache::forget($key);
    }

    /**
     * Clear all cache.
     */
    public function clear(): void
    {
        Cache::flush();
    }

    /**
     * Clear expired cache.
     */
    public function clearExpired(): void
    {
        // Redis handles expiration automatically! No action needed.
    }
}
