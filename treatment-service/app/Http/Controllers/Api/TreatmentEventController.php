<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateTreatmentEventRequestDTO;
use App\DTOs\Requests\Update\UpdateTreatmentEventRequestDTO;
use App\Services\TreatmentEventService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TreatmentEventController extends Controller
{
    public function __construct(
        protected TreatmentEventService $eventService
    ) {}

    /**
     * API: Tạo sự kiện điều trị mới
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Lễ tân kiểm tra hồ sơ (Validation)
        $validated = $request->validate([
            'treatment_id' => 'required|integer',
            'event_type'   => 'required|in:egg_retrieval,embryo_transfer,insemination,ultrasound,blood_test,consultation,other',
            'event_date'   => 'required|date',
            'description'  => 'nullable|string',
            'result'       => 'nullable|string',
            'doctor_notes' => 'nullable|string',
            'attachments'  => 'nullable|array',
        ]);

        // 2. Đóng gói hồ sơ vào khay (DTO)
        $dto = CreateTreatmentEventRequestDTO::fromArray($validated);

        // 3. Giao cho Chuyên gia (Service) xử lý lưu trữ
        $responseDTO = $this->eventService->createEvent($dto);

        // 4. Báo kết quả thành công cho React
        return response()->json([
            'message' => 'Ghi nhận sự kiện điều trị thành công',
            'data'    => $responseDTO->toArray()
        ], 201);
    }

    /**
     * API: Lấy danh sách sự kiện của một đợt điều trị (Timeline)
     */
    public function index(Request $request): JsonResponse
    {
        // Lấy treatment_id từ link (VD: /api/events?treatment_id=1)
        $treatmentId = $request->query('treatment_id');

        if (!$treatmentId) {
            return response()->json(['message' => 'Thiếu treatment_id'], 400);
        }

        // Gọi Service lấy dữ liệu theo đúng tên hàm mới
        $data = $this->eventService->getEventsByTreatment((int) $treatmentId);

        return response()->json([
            'data' => $data
        ], 200);
    }
    
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'result'       => 'nullable|string',
            'doctor_notes' => 'nullable|string',
            'attachments'  => 'nullable|array',
        ]);

        $dto = UpdateTreatmentEventRequestDTO::fromArray($validated);
        $response = $this->eventService->updateEvent($id, $dto);
        return response()->json(['message' => 'Cập nhật sự kiện thành công', 'data' => $response->toArray()]);
    }

}