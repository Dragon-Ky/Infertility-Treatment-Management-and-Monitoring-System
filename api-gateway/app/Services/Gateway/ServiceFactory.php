<?php

namespace App\Services\Gateway;

class ServiceFactory
{
    /**
     * Map tên service với Class Client tương ứng
     */
    protected array $clients = [
        'auth' => AuthServiceClient::class,
        'treatment' => TreatmentServiceClient::class,
        'appointment' => AppointmentServiceClient::class,
        'catalog' => CatalogServiceClient::class,
        'notification' => NotificationServiceClient::class,
        'report' => ReportServiceClient::class,

    ];

    /**
     * Khởi tạo Client tương ứng theo tên service
     */
    public function make(string $serviceName): BaseServiceClient
    {
        if (!isset($this->clients[$serviceName])) {
            throw new \Exception("Dịch vụ '{$serviceName}' chưa được cấu hình tại API Gateway.");
        }

        $clientClass = $this->clients[$serviceName];
        return new $clientClass();
    }
}
