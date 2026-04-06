<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateMedicationRecordRequestDTO;
use App\DTOs\Requests\Update\UpdateMedicationRecordRequestDTO;
use App\Services\MedicationRecordService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicationRecordController extends Controller
{
    public function __construct(protected MedicationRecordService $recordService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medication_schedule_id' => 'required|integer',
            'scheduled_time'         => 'required|date',
            'actual_time'            => 'required|date',
            'status'                 => 'required|in:taken,missed,skipped',
            'recorded_by'            => 'required|integer',
            'notes'                  => 'nullable|string',
        ]);

        $dto = CreateMedicationRecordRequestDTO::fromArray($validated);
        $responseDTO = $this->recordService->createRecord($dto);

        return response()->json([
            'message' => 'Ghi nhận dùng thuốc thành công', 
            'data' => $responseDTO->toArray()
        ], 201);
    }
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'actual_time' => 'nullable|date',
            'status'      => 'nullable|in:taken,missed,skipped',
            'notes'       => 'nullable|string',
        ]);

        $dto = UpdateMedicationRecordRequestDTO::fromArray($validated);
        $response = $this->recordService->updateRecord($id, $dto);
        return response()->json(['message' => 'Cập nhật ghi nhận thành công', 'data' => $response->toArray()]);
    }
    public function destroy(int $id): JsonResponse
    {
        $this->recordService->deleteRecord($id);
        return response()->json([
            'message' => 'Xóa ghi nhận dùng thuốc thành công'
        ], 200);
    }
    public function show(int $id): JsonResponse
    {
        $record = $this->recordService->getRecordById($id);

        if (!$record || !$record->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy ghi nhận dùng thuốc hoặc đã bị vô hiệu hóa'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $record->toArray()
        ], 200);
    }
}