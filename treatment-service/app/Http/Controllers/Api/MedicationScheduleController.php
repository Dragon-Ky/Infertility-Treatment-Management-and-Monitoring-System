<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateMedicationScheduleRequestDTO;
use App\Services\MedicationScheduleService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicationScheduleController extends Controller
{
    public function __construct(protected MedicationScheduleService $scheduleService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'protocol_id' => 'required|integer',
            'medicine_name' => 'required|string',
            'dosage' => 'required|string',
            'scheduled_at' => 'required|date',
            'route' => 'required|string',
        ]);

        $dto = CreateMedicationScheduleRequestDTO::fromArray($validated);
        $responseDTO = $this->scheduleService->createSchedule($dto);

        return response()->json(['message' => 'Lên lịch dùng thuốc thành công', 'data' => $responseDTO->toArray()], 201);
    }
}