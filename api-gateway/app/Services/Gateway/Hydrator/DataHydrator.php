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
        // 1. Chỉ xử lý nếu là service treatment
        if ($service !== 'treatment') {
            return $data;
        }

        // 2. Kiểm tra xem route có cần hydrate không
        // Các route cần tên bệnh nhân: dashboard summary và danh sách protocols
        if (str_contains($path, 'dashboard/summary') || str_contains($path, 'protocols')) {
            return $this->hydrateTreatmentData($data);
        }

        return $data;
    }

    /**
     * Thực hiện nối dữ liệu cho Treatment Service
     */
    protected function hydrateTreatmentData(array $data): array
    {
        try {
            // Nếu là response từ dashboard summary, dữ liệu nằm trong 'data'
            // và có các phần như 'upcoming_queue'
            if (isset($data['upcoming_queue'])) {
                $data['upcoming_queue'] = $this->hydrateList($data['upcoming_queue']);
                return $data;
            }

            // Nếu là response list (phân trang hoặc mảng đơn)
            if (isset($data['data']) && is_array($data['data'])) {
                // Nếu là danh sách đã phân trang
                if (isset($data['current_page'])) {
                    $data['data'] = $this->hydrateList($data['data']);
                } else {
                    // Nếu là mảng data thuần túy (GET chi tiết hoặc GET all không phân trang)
                    $data['data'] = $this->hydrateItemOrList($data['data']);
                }
            }

            return $data;
        } catch (\Exception $e) {
            Log::error("Hydration Error: " . $e->getMessage());
            return $data; // Trả về dữ liệu gốc nếu lỗi để không làm chết Gateway
        }
    }

    protected function hydrateItemOrList(array $itemOrList): array
    {
        // Kiểm tra xem là item đơn hay list
        if (isset($itemOrList['treatment_id'])) {
            return $this->hydrateSingleItem($itemOrList);
        }
        
        return $this->hydrateList($itemOrList);
    }

    protected function hydrateList(array $list): array
    {
        foreach ($list as &$item) {
            $item = $this->hydrateSingleItem($item);
        }
        return $list;
    }

    protected function hydrateSingleItem(array $item): array
    {
        if (!isset($item['treatment_id'])) {
            return $item;
        }

        /** @var \App\Services\Gateway\Client\AppointmentServiceClient $appointmentClient */
        $appointmentClient = $this->factory->make('appointment');
        /** @var \App\Services\Gateway\Client\AuthServiceClient $authClient */
        $authClient = $this->factory->make('auth');

        // 1. Lấy thông tin đợt điều trị từ appointment-service để có user_id
        $treatment = $appointmentClient->getTreatmentById($item['treatment_id']);
        
        if ($treatment && isset($treatment['user_id'])) {
            $item['customer_id'] = $treatment['user_id'];
            
            // 2. Lấy tên bệnh nhân từ auth-service
            $user = $authClient->getUserById($treatment['user_id']);
            if ($user) {
                $item['customer_name'] = $user['name'] ?? 'Unknown';
            }
        }

        // 3. Lấy tên bác sĩ nếu có doctor_id
        if (isset($item['doctor_id'])) {
            $doctor = $authClient->getUserById($item['doctor_id']);
            if ($doctor) {
                $item['doctor_name'] = $doctor['name'] ?? 'Unknown';
            }
        }

        return $item;
    }
}
