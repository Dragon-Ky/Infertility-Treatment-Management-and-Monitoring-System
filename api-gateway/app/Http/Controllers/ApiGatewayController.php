<?php

namespace App\Http\Controllers;

use App\Services\Gateway\ServiceFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApiGatewayController extends Controller
{
    protected ServiceFactory $factory;

    public function __construct(ServiceFactory $factory)
    {
        $this->factory = $factory;
    }

    /**
     * Endpoint tập trung xử lý mọi request proxy
     */
    public function handle(string $service)
    {
        try {
            // 1. Khởi tạo client phù hợp
            $client = $this->factory->make($service);
            
            // 2. Thực hiện forward request
            $response = $client->forward();

            // 3. Trả lại response nguyên bản cho người dùng
            return response($response->body(), $response->status())
                   ->header('Content-Type', 'application/json');

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
