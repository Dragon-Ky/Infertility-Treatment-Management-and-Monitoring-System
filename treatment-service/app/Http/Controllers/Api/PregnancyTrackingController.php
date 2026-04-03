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
            'protocol_id' => 'required|integer',
            'beta_hcg_level' => 'nullable|numeric',
            'gestational_age_weeks' => 'nullable|integer|min:0',
            'fetal_heartbeat' => 'nullable|string',
            'outcome' => 'required|in:ongoing,miscarriage,live_birth,ectopic',
        ]);

        $dto = CreatePregnancyTrackingRequestDTO::fromArray($validated);
        $responseDTO = $this->trackingService->createTracking($dto);

        return response()->json(['message' => 'Lưu hồ sơ theo dõi thai kỳ thành công', 'data' => $responseDTO->toArray()], 201);
    }
}