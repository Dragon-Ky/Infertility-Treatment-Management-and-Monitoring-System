<?php

namespace App\Http\Controllers;

use App\Services\Gateway\ServiceFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApiGatewayController extends Controller
{
    protected ServiceFactory $factory;
    protected \App\Services\Gateway\Hydrator\DataHydrator $hydrator;

    public function __construct(ServiceFactory $factory, \App\Services\Gateway\Hydrator\DataHydrator $hydrator)
    {
        $this->factory = $factory;
        $this->hydrator = $hydrator;
    }

    /**
     * Endpoint tập trung xử lý mọi request proxy
     */
    public function handle(string $service, string $path)
    {
        try {
            // 1. Khởi tạo client phù hợp
            $client = $this->factory->make($service);
            
            // 2. Thực hiện forward request
            $response = $client->forward();

            // 3. Xử lý dữ liệu (Data Joining/Hydration) nếu cần
            $data = $response->json();
            if ($response->successful() && is_array($data)) {
                $data = $this->hydrator->hydrate($service, $path, $data);
            }

            // 4. Trả lại response đã được hydrate cho người dùng
            return response()->json($data, $response->status());

        } catch (\Exception $e) {
            Log::error("Gateway Error: " . $e->getMessage());
            
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi kết nối từ API Gateway tới dịch vụ nội bộ.',
                'debug'   => $e->getMessage()
            ], 502);
        }
    }
}
