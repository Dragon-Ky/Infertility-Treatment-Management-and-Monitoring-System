<?php

namespace App\Services\Gateway;

class AppointmentServiceClient extends BaseServiceClient
{
    protected string $serviceName = 'appointment';

    /**
     * Lấy thông tin đợt điều trị (để lấy user_id)
     */
    public function getTreatmentById(int $id)
    {
        $response = $this->get("treatments/{$id}");
        if (!$response->successful()) return null;

        $data = $response->json();
        return $data['data'] ?? $data;
    }

    /**
     * Lấy danh sách đợt điều trị theo ID
     */
    public function getTreatmentsByIds(array $ids)
    {
        $response = $this->get("treatments/internal/bulk", ['ids' => $ids]);
        if (!$response->successful()) return [];
        
        return $response->json('data') ?? [];
    }
}
