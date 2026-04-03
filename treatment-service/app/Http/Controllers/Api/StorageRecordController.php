<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateStorageRecordRequestDTO;
use App\Services\StorageRecordService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StorageRecordController extends Controller
{
    public function __construct(protected StorageRecordService $storageService) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'patient_id' => 'required|integer',
            'sample_type' => 'required|string',
            'tank_location' => 'required|string',
            'freeze_date' => 'required|date',
            'expiration_date' => 'required|date|after:freeze_date',
        ]);

        $dto = CreateStorageRecordRequestDTO::fromArray($validated);
        $responseDTO = $this->storageService->createStorage($dto);

        return response()->json(['message' => 'Lưu hồ sơ trữ đông thành công', 'data' => $responseDTO->toArray()], 201);
    }
}