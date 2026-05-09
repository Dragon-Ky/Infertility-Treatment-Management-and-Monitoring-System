<?php

namespace App\Services\Gateway;

class AuthServiceClient extends BaseServiceClient
{
    protected string $serviceName = 'auth';

    /**
     * Lấy thông tin User theo ID (Dùng cho data joining)
     */
    public function getUserById(int $id)
    {
        $response = $this->get("doctor/customers/{$id}");
        if (!$response->successful()) return null;
        
        $data = $response->json();
        return $data['data'] ?? $data;
    }

    /**
     * Lấy thông tin nhiều User theo danh sách ID
     */
    public function getUsersByIds(array $ids)
    {
        $response = $this->get("internal/users", ['ids' => $ids]);
        if (!$response->successful()) return [];
        
        return $response->json('data') ?? [];
    }
}
