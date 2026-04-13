<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateTreatmentProtocolRequestDTO;
use App\DTOs\Requests\Update\UpdateTreatmentProtocolRequestDTO;
use App\Services\TreatmentProtocolService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TreatmentProtocolController extends Controller
{
    public function __construct(protected TreatmentProtocolService $protocolService) {}

    public function index(): JsonResponse
    {
        $data = $this->protocolService->getAllActive();
        return response()->json(['data' => $data], 200);
    }

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
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id'     => 'nullable|integer',
            'protocol_name' => 'nullable|string|max:255',
            'diagnosis'     => 'nullable|string',
            'prescription'  => 'nullable|string',
            'notes'         => 'nullable|string',
        ]);

        $dto = UpdateTreatmentProtocolRequestDTO::fromArray($validated);
        $response = $this->protocolService->updateProtocol($id, $dto);
        return response()->json(['message' => 'Cập nhật phác đồ thành công', 'data' => $response->toArray()]);
    }
    public function destroy(int $id): JsonResponse
    {
        $this->protocolService->deleteProtocol($id);
        return response()->json([
            'message' => 'Xóa phác đồ điều trị thành công'
        ], 200);
    }
     public function show(int $id): JsonResponse
    {
        try {
            $protocol = $this->protocolService->getProtocolById($id);
            return response()->json([
                'success' => true,
                'data' => $protocol->toArray()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
}