<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateMedicationScheduleRequestDTO;
use App\DTOs\Requests\Update\UpdateMedicationScheduleRequestDTO;
use App\Services\MedicationScheduleService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MedicationScheduleController extends Controller
{
    public function __construct(protected MedicationScheduleService $scheduleService)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'treatment_id' => 'required|integer',
            'medication_name' => 'required|string',
            'dosage' => 'required|string',
            'frequency' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'time_slots' => 'required|array',
            'route' => 'required|in:injection,oral,vaginal,other',
        ]);

        $dto = CreateMedicationScheduleRequestDTO::fromArray($validated);
        $responseDTO = $this->scheduleService->createSchedule($dto);

        return response()->json([
            'message' => 'Lên lịch dùng thuốc thành công',
            'data' => $responseDTO->toArray()
        ], 201);
    }
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'medication_name' => 'nullable|string',
            'dosage'          => 'nullable|string',
            'frequency'       => 'nullable|string',
            'status'          => 'nullable|in:active,completed,paused',
            'time_slots'      => 'nullable|array',
            'route'           => 'nullable|in:injection,oral,vaginal,other', // Bổ sung route
            'start_date'      => 'nullable|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
        ]);

        $dto = UpdateMedicationScheduleRequestDTO::fromArray($validated);
        $response = $this->scheduleService->updateSchedule($id, $dto);
        
        return response()->json([
            'message' => 'Cập nhật lịch thuốc thành công', 
            'data' => $response->toArray()
        ]);
    }
    public function destroy(int $id): JsonResponse
    {
        $this->scheduleService->deleteSchedule($id);
        return response()->json([
            'message' => 'Xóa lịch dùng thuốc thành công'
        ], 200);
    }
    public function show(int $id): JsonResponse
    {
        try {
            $schedule = $this->scheduleService->getScheduleById($id);
            return response()->json([
                'success' => true,
                'data' => $schedule->toArray()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
}