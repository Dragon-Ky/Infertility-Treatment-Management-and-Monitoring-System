<?php

namespace App\Services;

use App\Models\SyncLog;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class NiFiService
{
    protected $client;
    protected $baseUrl;
    protected $username;
    protected $password;

    public function __construct()
    {
        $this->client = new Client([
            'verify' => false, // Skip SSL verification for NiFi's self-signed cert
        ]);
        $this->baseUrl = env('NIFI_BASE_URL', 'https://nifi:8443');
        $this->username = env('NIFI_USERNAME', 'admin');
        $this->password = env('NIFI_PASSWORD', 'reportservice');
    }

    /**
     * Trigger data synchronization.
     */
    public function triggerSync(string $sourceService, string $syncType): array
    {
        try {
            // In a real implementation, this would call NiFi API
            // For now, we'll simulate the sync process
            $result = $this->simulateSync($sourceService, $syncType);

            // Log the sync operation
            SyncLog::create([
                'source_service' => $sourceService,
                'sync_type' => $syncType,
                'records_synced' => $result['records_synced'],
                'status' => $result['status'],
                'error_message' => $result['error_message'] ?? null,
                'synced_at' => now(),
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('NiFi sync failed', [
                'source_service' => $sourceService,
                'sync_type' => $syncType,
                'error' => $e->getMessage(),
            ]);

            SyncLog::create([
                'source_service' => $sourceService,
                'sync_type' => $syncType,
                'records_synced' => 0,
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'synced_at' => now(),
            ]);

            throw $e;
        }
    }

    /**
     * Simulate sync operation.
     */
    protected function simulateSync(string $sourceService, string $syncType): array
    {
        // Simulate different sync scenarios
        $records = rand(10, 100);

        return [
            'status' => 'success',
            'records_synced' => $records,
            'source_service' => $sourceService,
            'sync_type' => $syncType,
            'message' => "Successfully synced {$records} records from {$sourceService}",
        ];
    }

    /**
     * Get NiFi flow status.
     */
    public function getFlowStatus(): array
    {
        try {
            // In a real implementation, this would call NiFi API
            return [
                'status' => 'running',
                'active_threads' => 5,
                'total_processors' => 10,
                'running_processors' => 8,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get NiFi flow status', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
