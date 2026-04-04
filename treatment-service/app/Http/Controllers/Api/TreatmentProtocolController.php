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
            'treatment_id'  => 'required|integer',
            'doctor_id'     => 'required|integer',
            'protocol_name' => 'required|string|max:255',
            'diagnosis'     => 'nullable|string',
            'prescription'  => 'nullable|string',
            'notes'         => 'nullable|string',
        ]);

        $dto = CreateTreatmentProtocolRequestDTO::fromArray($validated);
        $responseDTO = $this->protocolService->createProtocol($dto);

        return response()->json([
            'status'  => 'success',
            'message' => 'Tạo phác đồ thành công',
            'data'    => $responseDTO->toArray()
        ], 201);
    }
}