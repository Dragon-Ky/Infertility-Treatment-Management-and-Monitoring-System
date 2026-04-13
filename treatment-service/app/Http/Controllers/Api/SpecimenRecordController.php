<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateSpecimenRecordRequestDTO;
use App\DTOs\Requests\update\UpdateSpecimenRecordRequestDTO;
use App\Services\SpecimenRecordService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SpecimenRecordController extends Controller
{
    public function __construct(
        protected SpecimenRecordService $specimenService
    ) {
    }

    public function index(): JsonResponse
    {
        $data = $this->specimenService->getAllActive();
        return response()->json(['data' => $data], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'treatment_id' => 'required|integer',
            'type' => 'required|in:embryo,egg,sperm',
            'specimen_code' => 'required|string|unique:specimen_records,specimen_code',
            // Chỉ require fertilization_date và development_day nếu type == embryo
            'fertilization_date' => 'nullable|date',
            'development_day' => 'nullable|integer|in:3,5,6',
            'grade' => 'nullable|string',
            'status' => 'required|in:fresh,frozen,used,discarded',
            'notes' => 'nullable|string',
        ]);

        $dto = CreateSpecimenRecordRequestDTO::fromArray($validated);
        $responseDTO = $this->specimenService->createSpecimen($dto);

        return response()->json([
            'message' => 'Lưu hồ sơ mẫu vật thành công',
            'data' => $responseDTO->toArray()
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'development_day' => 'nullable|integer|in:3,5,6',
            'grade' => 'nullable|string',
            'status' => 'nullable|in:fresh,frozen,used,discarded',
            'notes' => 'nullable|string',
        ]);

        $dto = UpdateSpecimenRecordRequestDTO::fromArray($validated);
        $response = $this->specimenService->updateSpecimen($id, $dto);
        return response()->json(['message' => 'Cập nhật mẫu vật thành công', 'data' => $response->toArray()]);
    }
    
    public function destroy(int $id): JsonResponse
    {
        $this->specimenService->deleteSpecimen($id);
        return response()->json([
            'message' => 'Xóa hồ sơ mẫu vật thành công'
        ], 200);
    }
}
