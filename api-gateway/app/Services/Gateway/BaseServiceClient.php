<?php

namespace App\Services\Gateway;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Log;

abstract class BaseServiceClient
{
    protected string $serviceName;
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config("services.microservices.{$this->serviceName}.url");
    }

    /**
     * Tự động forward request từ client tới service con
     */
    public function forward(): Response
    {
        $request = request();
        $method = $request->method();
        
        // Lấy path sạch (ví dụ: api/treatment/patients/1 -> patients/1)
        $path = $request->path();
        // Regex để loại bỏ phần 'api/{serviceName}/' khỏi đầu đường dẫn
        $targetPath = preg_replace("/^api\/{$this->serviceName}\//", "", $path);

        // Gửi request tới service đích với đầy đủ header và body
        return Http::withHeaders($this->getHeaders())
            ->timeout(10)
            ->withBody($request->getContent(), $request->header('Content-Type'))
            ->send($method, "{$this->baseUrl}/api/{$targetPath}", [
                'query' => $request->query()
            ]);
    }

    /**
     * Gửi request GET nội bộ tới service con
     */
    public function get(string $path, array $query = []): Response
    {
        return Http::withHeaders($this->getHeaders())
            ->timeout(5)
            ->get("{$this->baseUrl}/api/{$path}", $query);
    }

    /**
     * Lấy danh sách headers cần thiết cho request nội bộ
     */
    protected function getHeaders(): array
    {
        return [
            'Authorization' => request()->header('Authorization'),
            'X-Internal-Secret' => config('services.gateway.internal_secret'),
            'Accept' => 'application/json',
            'X-Forwarded-For' => request()->ip(),
        ];
    }
}
