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
            'treatment_id'    => 'required|integer',
            'test_type'       => 'required|in:blood,ultrasound,hormone,spermogram,other',
            'test_date'       => 'required|date',
            'result_data'     => 'required|array', // Dữ liệu chỉ số phải là mảng
            'reference_range' => 'nullable|string',
            'unit'            => 'nullable|string',
            'notes'           => 'nullable|string',
            'doctor_notes'    => 'nullable|string',
            'attachments'     => 'nullable|array',
        ]);

        $dto = CreateLabResultRequestDTO::fromArray($validated);
        $responseDTO = $this->labService->createLabResult($dto);

        return response()->json([
            'message' => 'Lưu kết quả xét nghiệm thành công', 
            'data' => $responseDTO->toArray()
        ], 201);
    }
}