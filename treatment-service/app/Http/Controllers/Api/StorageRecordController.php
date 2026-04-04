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
            'treatment_id'  => 'required|integer',
            'storage_type'  => 'required|in:embryo,sperm,oocyte',
            'item_id'       => 'required|integer',
            'start_date'    => 'required|date',
            'expiry_date'   => 'required|date|after:start_date',
            'location_code' => 'required|string|max:50',
        ]);

        $dto = CreateStorageRecordRequestDTO::fromArray($validated);
        $responseDTO = $this->storageService->createStorage($dto);

        return response()->json([
            'message' => 'Lưu hồ sơ trữ đông thành công', 
            'data' => $responseDTO->toArray()
        ], 201);
    }
}