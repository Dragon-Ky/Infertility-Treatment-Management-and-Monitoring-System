<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateMedicationRecordRequestDTO;
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
}