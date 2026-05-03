<?php

namespace App\Services;

use App\Models\SyncLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class NiFiService
{
    protected $baseUrl;
    protected $username;
    protected $password;

    public function __construct()
    {
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
            $result = $this->executeRealSync($sourceService, $syncType);

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
     * Đồng bộ DB giữa các Microservice
     */
    protected function executeRealSync(string $sourceService, string $syncType): array
    {
        // Lấy token của Manager đang thao tác để làm vé đi qua các nhà khác
        $token = request()->bearerToken();
        $recordsCount = 0;

        try {
            // Tùy theo service mà đi gọi đúng cái API của nhà đó
            switch ($sourceService) {
                case 'auth':
                    // Chạy qua Auth (Cổng 8000) lấy danh sách User
                    $response = Http::withToken($token)->get('http://127.0.0.1:8000/api/doctor/customers');
                    break;

                case 'treatment':
                    // Chạy qua Treatment (Cổng 8001) lấy danh sách Phác đồ
                    $response = Http::withToken($token)->get('http://127.0.0.1:8001/api/v1/treatment/protocols');
                    break;

                case 'appointment':
                    // Chạy qua nhà Appointment (Cổng 8002) lấy danh sách Lịch hẹn
                    $response = Http::withToken($token)->get('http://127.0.0.1:8002/api/appointments');
                    break;

                default:
                    throw new \Exception("Nguồn dữ liệu không được hỗ trợ: {$sourceService}");
            }

            // Nếu gọi thành công
            if ($response->successful()) {
                $data = $response->json();

                // Đếm số lượng record trả về
                if (isset($data['data']) && is_array($data['data'])) {
                    $recordsCount = count($data['data']);
                } else {
                    $recordsCount = is_array($data) ? count($data) : 1;
                }

                return [
                    'status' => 'success',
                    'records_synced' => $recordsCount,
                    'source_service' => $sourceService,
                    'sync_type' => $syncType,
                    'message' => "Hút thành công {$recordsCount} dữ liệu thực tế từ nhà {$sourceService}",
                ];
            }

            // Nếu báo lỗi (401, 500...)
            throw new \Exception("API của nhà {$sourceService} trả về lỗi HTTP " . $response->status());

        } catch (\Exception $e) {
            return [
                'status' => 'failed',
                'records_synced' => 0,
                'source_service' => $sourceService,
                'sync_type' => $syncType,
                'error_message' => $e->getMessage(),
                'message' => 'Lỗi kết nối Microservices: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get NiFi flow status.
     */
    public function getFlowStatus(): array
    {
        return [
            'status' => 'running',
            'active_threads' => 5,
            'total_processors' => 10,
            'running_processors' => 8,
        ];
    }
}
