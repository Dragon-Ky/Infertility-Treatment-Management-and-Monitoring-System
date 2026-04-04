<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateEmbryoRecordRequestDTO;
use App\Services\EmbryoRecordService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EmbryoRecordController extends Controller
{
    public function __construct(protected EmbryoRecordService $embryoService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'treatment_id'       => 'required|integer',
            'embryo_code'        => 'required|string|unique:embryo_records,embryo_code',
            'fertilization_date' => 'required|date',
            'development_day'    => 'required|in:3,5,6',
            'grade'              => 'required|string',
            'status'             => 'required|in:frozen,transferred,discarded',
            'notes'              => 'nullable|string',
        ]);

        $dto = CreateEmbryoRecordRequestDTO::fromArray($validated);
        $responseDTO = $this->embryoService->createEmbryo($dto);

        return response()->json([
            'message' => 'Lưu hồ sơ phôi thành công',
            'data'    => $responseDTO->toArray()
        ], 201);
    }
}