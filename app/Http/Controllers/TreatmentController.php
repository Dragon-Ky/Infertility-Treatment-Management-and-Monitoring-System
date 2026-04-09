<?php

namespace App\Http\Controllers;

use App\Models\Treatment;
use App\Services\RabbitMQService;
use Illuminate\Http\Request;

class TreatmentController extends Controller 
{
    protected $rabbitmq;
    public function __construct(RabbitMQService $rabbitmq) { $this->rabbitmq = $rabbitmq; }

    // Xem lịch trình điều trị của bệnh nhân
    public function show($id)
    {
        $treatment = Treatment::with('appointments')->find($id);
        return $treatment ? response()->json($treatment) : response()->json(['msg' => 'Not found'], 404);
    }

    // Đăng ký phác đồ điều trị mới
    public function register(Request $request) {
        $treatment = Treatment::create($request->all());
        
        // Event này giúp Service khác tạo danh sách các đầu việc tự động (Ví dụ: lịch tiêm thuốc)
        $this->rabbitmq->publish('treatment.created', $treatment->toArray());
        
        return response()->json($treatment, 201);
    }

    // Cập nhật trạng thái điều trị (Ví dụ: Đang theo dõi -> Đã chọc trứng)
    public function updateStatus(Request $request, $id)
    {
        $treatment = Treatment::find($id);
        $treatment->update(['status' => $request->status]);
        
        return response()->json(['message' => 'Status updated', 'data' => $treatment]);
    }
}