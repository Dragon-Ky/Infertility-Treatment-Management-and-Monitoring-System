<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateTreatmentEventRequestDTO;
use App\Services\TreatmentEventService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TreatmentEventController extends Controller
{
    public function __construct(
        protected TreatmentEventService $eventService
    ) {}

    // API: Tạo sự kiện mới
    public function store(Request $request): JsonResponse
    {
        // Lễ tân kiểm tra form
        $validated = $request->validate([
            'protocol_id' => 'required|integer',
            'event_type' => 'required|string',
            'title' => 'required|string|max:255',
            'event_datetime' => 'required|date',
            'result_summary' => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        // Đóng gói hồ sơ
        $dto = CreateTreatmentEventRequestDTO::fromArray($validated);

        // Giao cho Chuyên gia xử lý
        $responseDTO = $this->eventService->createEvent($dto);

        // Báo kết quả cho Frontend (React)
        return response()->json([
            'message' => 'Tạo sự kiện thành công',
            'data' => $responseDTO->toArray()
        ], 201);
    }

    // API: Lấy danh sách sự kiện của 1 phác đồ
    public function index(Request $request): JsonResponse
    {
        $protocolId = $request->query('protocol_id');
        $data = $this->eventService->getEventsByProtocol((int) $protocolId);

        return response()->json(['data' => $data], 200);
    }
}