<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateLabResultRequestDTO;
use App\DTOs\Requests\Update\UpdateLabResultRequestDTO;
use App\Services\LabResultService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LabResultController extends Controller
{
    public function __construct(protected LabResultService $labService)
    {
    }

    public function index(): JsonResponse
    {
        $data = $this->labService->getAllActive();
        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'treatment_id' => 'required|integer',
            'test_type' => 'required|in:blood,ultrasound,hormone,spermogram,other',
            'test_date' => 'required|date',
            'result_data' => 'required|array', // Dữ liệu chỉ số phải là mảng
            'reference_range' => 'nullable|string',
            'unit' => 'nullable|string',
            'notes' => 'nullable|string',
            'doctor_notes' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        $dto = CreateLabResultRequestDTO::fromArray($validated);
        $responseDTO = $this->labService->createLabResult($dto);

        return response()->json([
            'message' => 'Lưu kết quả xét nghiệm thành công',
            'data' => $responseDTO->toArray()
        ], 201);
    }
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'result_data' => 'nullable|array',
            'doctor_notes' => 'nullable|string',
            'attachments' => 'nullable|array',
        ]);

        $dto = UpdateLabResultRequestDTO::fromArray($validated);
        $response = $this->labService->updateLabResult($id, $dto);
        return response()->json(['message' => 'Cập nhật kết quả thành công', 'data' => $response->toArray()]);
    }
    public function destroy(int $id): JsonResponse
    {
        $this->labService->deleteLabResult($id);
        return response()->json([
            'message' => 'Xóa kết quả xét nghiệm thành công'
        ], 200);
    }
    public function show(int $id): JsonResponse
    {
        try {
            $labResult = $this->labService->getLabResultById($id);
            return response()->json([
                'success' => true,
                'data' => $labResult->toArray()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
}