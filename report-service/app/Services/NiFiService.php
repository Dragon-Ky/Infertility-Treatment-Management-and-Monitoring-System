<?php

namespace App\Services;

use App\Models\SyncLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

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


    /*
     * Đồng bộ DB giữa các Microservice
     */
    protected function executeRealSync(string $sourceService, string $syncType): array
    {
        $token = request()->bearerToken();
        $recordsCount = 0;

        try {
            switch ($sourceService) {
                case 'auth':
                    $response = Http::withToken($token)->get('http://127.0.0.1:8000/api/doctor/customers');
                    if (!$response->successful()) {
                        throw new \Exception("Auth API trả về lỗi: " . $response->status());
                    }

                    $data = $response->json();
                    $customers = isset($data['data']) ? $data['data'] : (is_array($data) ? $data : []);

                    foreach ($customers as $c) {
                        DB::table('synced_patients')->updateOrInsert(
                            ['remote_id' => $c['id'] ?? rand(1000, 9999)],
                            [
                                'name' => $c['name'] ?? $c['full_name'] ?? 'Bệnh nhân ẩn danh',
                                'gender' => $c['gender'] ?? 'N/A',
                                'synced_at' => now(),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]
                        );
                    }
                    $recordsCount = count($customers);
                    break;

                case 'treatment':
                    // Lấy phác đồ từ nhà Treatment
                    $response = Http::withToken($token)->get('http://127.0.0.1:8001/api/v1/treatment/protocols');
                    if (!$response->successful()) {
                        throw new \Exception("Treatment API trả về lỗi: " . $response->status());
                    }
                    $data = $response->json();
                    $protocols = isset($data['data']) ? $data['data'] : (is_array($data) ? $data : []);
                    $recordsCount = count($protocols);

                    $doctorCases = [];
                    foreach ($protocols as $p) {
                        // đếm bác sĩ ID này đang có bao nhiêu ca
                        $docId = $p['doctor_id'];
                        if (!isset($doctorCases[$docId])) $doctorCases[$docId] = 0;
                        $doctorCases[$docId]++;

                        // Tính tổng tiền
                            ['remote_id' => $p['id']],
                            [
                                'status' => $p['status'] ?? 'in_progress',
                                'price' => isset($p['price']) ? (int)$p['price'] : 0,
                                'synced_at' => now(),
                                // Nếu API Treatment có trả về created_at, dùng nó để filter theo tháng cho chuẩn. Nếu không thì dùng giờ hiện tại.
                                'created_at' => isset($p['created_at']) ? \Carbon\Carbon::createFromFormat('d/m/Y H:i', $p['created_at'])->format('Y-m-d H:i:s') : now(),
                                'updated_at' => now(),
                            ]
                        );
                    }

                    // Chạy qua Auth lấy tên Bác sĩ
                    $authResponse = Http::withToken($token)->get('http://127.0.0.1:8000/api/doctors');
                    $doctorsList = [];
                    if ($authResponse->successful()) {
                        $authData = $authResponse->json();
                        $docs = isset($authData['data']) ? $authData['data'] : (is_array($authData) ? $authData : []);
                        foreach ($docs as $d) {
                            $doctorsList[$d['id']] = $d['name'];
                        }
                    }

                    // Ráp Tên và Số ca lại, lưu vào bảng synced_doctors
                    foreach ($doctorCases as $docId => $cases) {
                        $docName = $doctorsList[$docId] ?? "Bác sĩ ID: {$docId}";
                        DB::table('synced_doctors')->updateOrInsert(
                            ['doctor_id' => $docId],
                            ['name' => $docName, 'cases_count' => $cases, 'updated_at' => now()]
                        );
                    }
                    DB::table('synced_doctors')->whereNotIn('doctor_id', array_keys($doctorCases))->delete();
                    break;

                case 'appointment':
                    // Appointment (Cổng 8002) lấy danh sách Lịch hẹn
                    $response = Http::withToken($token)->get('http://127.0.0.1:8002/api/appointments');
                    if (!$response->successful()) {
                        throw new \Exception("Appointment API trả về lỗi: " . $response->status());
                    }
                    $data = $response->json();
                    $appointments = isset($data['data']) ? $data['data'] : (is_array($data) ? $data : []);
                    $recordsCount = count($appointments);
                    break;

                default:
                    throw new \Exception("Nguồn dữ liệu không được hỗ trợ: {$sourceService}");
            }

            // Trả về thành công ngay tại đây
            return [
                'status' => 'success',
                'records_synced' => $recordsCount,
                'source_service' => $sourceService,
                'sync_type' => $syncType,
                'message' => "Hút thành công {$recordsCount} dữ liệu từ {$sourceService}",
            ];

        } catch (\Exception $e) {
            return [
                'status' => 'failed',
                'records_synced' => 0,
                'source_service' => $sourceService,
                'sync_type' => $syncType,
                'error_message' => $e->getMessage(),
                'message' => 'Lỗi luân chuyển: ' . $e->getMessage(),
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
