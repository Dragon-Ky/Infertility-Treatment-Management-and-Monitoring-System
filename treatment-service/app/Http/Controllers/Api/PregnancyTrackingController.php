<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreatePregnancyTrackingRequestDTO;
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
}