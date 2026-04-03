<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateTreatmentProtocolRequestDTO;
use App\Services\TreatmentProtocolService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TreatmentProtocolController extends Controller
{
    public function __construct(protected TreatmentProtocolService $protocolService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|integer',
            'doctor_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $dto = CreateTreatmentProtocolRequestDTO::fromArray($validated);
        $responseDTO = $this->protocolService->createProtocol($dto);

        return response()->json([
            'message' => 'Tạo phác đồ thành công',
            'data' => $responseDTO->toArray()
        ], 201);
    }
}