<?php

namespace App\Services\Gateway\Hydrator;

use App\Services\Gateway\ServiceFactory;
use Illuminate\Support\Facades\Log;

class DataHydrator
{
    protected ServiceFactory $factory;

    public function __construct(ServiceFactory $factory)
    {
        $this->factory = $factory;
    }

    /**
     * Hydrate dữ liệu dựa trên đường dẫn request
     */
    public function hydrate(string $service, string $path, array $data): array
    {
        if ($service !== 'treatment') {
            return $data;
        }

        if (str_contains($path, 'dashboard/summary') || str_contains($path, 'protocols')) {
            return $this->hydrateTreatmentData($data);
        }

        return $data;
    }

    /**
     * Thực hiện nối dữ liệu cho Treatment Service (Tối ưu Bulk Fetch)
     */
    protected function hydrateTreatmentData(array $data): array
    {
        try {
            // 1. Xác định danh sách items cần hydrate
            $items = [];
            $isDashboard = false;

            if (isset($data['upcoming_queue'])) {
                $items = &$data['upcoming_queue'];
                $isDashboard = true;
            } elseif (isset($data['data']) && is_array($data['data'])) {
                $items = &$data['data'];
            } else {
                // Trường hợp item đơn (chi tiết)
                $data = $this->hydrateSingleItem($data);
                return $data;
            }

            if (empty($items)) return $data;

            // 2. Thu thập tất cả ID cần thiết
            $treatmentIds = [];
            $doctorIds = [];
            foreach ($items as $item) {
                if (isset($item['treatment_id'])) $treatmentIds[] = $item['treatment_id'];
                if (isset($item['doctor_id'])) $doctorIds[] = $item['doctor_id'];
            }

            $treatmentIds = array_unique($treatmentIds);
            $doctorIds = array_unique($doctorIds);

            // 3. Truy vấn Bulk từ các service khác
            /** @var \App\Services\Gateway\Client\AppointmentServiceClient $appointmentClient */
            $appointmentClient = $this->factory->make('appointment');
            /** @var \App\Services\Gateway\Client\AuthServiceClient $authClient */
            $authClient = $this->factory->make('auth');

            // Lấy thông tin đợt điều trị
            $treatmentsMap = $appointmentClient->getTreatmentsByIds($treatmentIds);
            
            // Thu thập User ID của bệnh nhân từ treatmentsMap
            $patientIds = [];
            foreach ($treatmentsMap as $t) {
                if (isset($t['user_id'])) $patientIds[] = $t['user_id'];
            }

            // Lấy thông tin tất cả User (Bệnh nhân + Bác sĩ)
            $allUserIds = array_unique(array_merge($patientIds, $doctorIds));
            $usersMap = $authClient->getUsersByIds($allUserIds);

            // 4. Map ngược lại vào danh sách items ban đầu
            foreach ($items as &$item) {
                $tId = $item['treatment_id'] ?? null;
                $dId = $item['doctor_id'] ?? null;

                // Gắn thông tin bệnh nhân
                if ($tId && isset($treatmentsMap[$tId])) {
                    $uId = $treatmentsMap[$tId]['user_id'];
                    $item['customer_id'] = $uId;
                    if (isset($usersMap[$uId])) {
                        $item['customer_name'] = $usersMap[$uId]['name'] ?? 'Unknown';
                    }
                }

                // Gắn thông tin bác sĩ
                if ($dId && isset($usersMap[$dId])) {
                    $item['doctor_name'] = $usersMap[$dId]['name'] ?? 'Unknown';
                }
            }

            return $data;
        } catch (\Exception $e) {
            Log::error("Hydration Bulk Error: " . $e->getMessage());
            return $data;
        }
    }

    /**
     * Hydrate cho 1 item đơn lẻ (vẫn giữ để dùng khi cần)
     */
    protected function hydrateSingleItem(array $item): array
    {
        if (!isset($item['treatment_id'])) return $item;

        $appointmentClient = $this->factory->make('appointment');
        $authClient = $this->factory->make('auth');

        $treatment = $appointmentClient->getTreatmentById($item['treatment_id']);
        if ($treatment && isset($treatment['user_id'])) {
            $item['customer_id'] = $treatment['user_id'];
            $user = $authClient->getUserById($treatment['user_id']);
            if ($user) $item['customer_name'] = $user['name'] ?? 'Unknown';
        }

        if (isset($item['doctor_id'])) {
            $doctor = $authClient->getUserById($item['doctor_id']);
            if ($doctor) $item['doctor_name'] = $doctor['name'] ?? 'Unknown';
        }

        return $item;
    }
}
