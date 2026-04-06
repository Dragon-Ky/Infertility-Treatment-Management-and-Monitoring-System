<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreatePregnancyTrackingRequestDTO;
use App\DTOs\Requests\Update\UpdatePregnancyTrackingRequestDTO;
use App\Services\PregnancyTrackingService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PregnancyTrackingController extends Controller
{
    public function __construct(protected PregnancyTrackingService $trackingService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'treatment_id'  => 'required|integer',
            'tracking_date' => 'required|date',
            'week_number'   => 'required|integer|min:0|max:42', // Thai kỳ thường tối đa 42 tuần
            'status'        => 'required|in:ongoing,delivered,miscarried',
            'notes'         => 'nullable|string',
        ]);

        $dto = CreatePregnancyTrackingRequestDTO::fromArray($validated);
        $responseDTO = $this->trackingService->createTracking($dto);

        return response()->json([
            'message' => 'Lưu hồ sơ theo dõi thai kỳ thành công', 
            'data' => $responseDTO->toArray()
        ], 201);
    }
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'week_number' => 'nullable|integer|min:0',
            'status'      => 'nullable|in:ongoing,delivered,miscarried',
            'notes'       => 'nullable|string',
        ]);

        $dto = UpdatePregnancyTrackingRequestDTO::fromArray($validated);
        $response = $this->trackingService->updateTracking($id, $dto);
        return response()->json(['message' => 'Cập nhật theo dõi thành công', 'data' => $response->toArray()]);
    }
    public function destroy(int $id): JsonResponse
    {
        $this->trackingService->deleteTracking($id);
        return response()->json([
            'message' => 'Xóa hồ sơ theo dõi thai kỳ thành công'
        ], 200);
    }
    public function show(int $id): JsonResponse
    {
        $tracking = $this->trackingService->getTrackingById($id);

        if (!$tracking || !$tracking->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy hồ sơ theo dõi thai kỳ hoặc đã bị vô hiệu hóa'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $tracking->toArray()
        ], 200);
    }
}