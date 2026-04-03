<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateLabResultRequestDTO;
use App\Services\LabResultService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LabResultController extends Controller
{
    public function __construct(protected LabResultService $labService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'protocol_id' => 'required|integer',
            'test_name' => 'required|string',
            'result_value' => 'required|string',
            'unit' => 'required|string',
            'interpretation' => 'nullable|string',
        ]);

        $dto = CreateLabResultRequestDTO::fromArray($validated);
        $responseDTO = $this->labService->createLabResult($dto);

        return response()->json(['message' => 'Lưu kết quả xét nghiệm thành công', 'data' => $responseDTO->toArray()], 201);
    }
}