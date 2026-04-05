<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateStorageRecordRequestDTO;
use App\DTOs\Requests\Update\UpdateStorageRecordRequestDTO;
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
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'expiry_date'   => 'nullable|date',
            'status'        => 'nullable|in:active,expired,released',
            'location_code' => 'nullable|string',
        ]);

        $dto = UpdateStorageRecordRequestDTO::fromArray($validated);
        $response = $this->storageService->updateStorage($id, $dto);
        return response()->json(['message' => 'Cập nhật trữ đông thành công', 'data' => $response->toArray()]);
    }
    public function destroy(int $id): JsonResponse
    {
        $this->storageService->deleteStorageRecord($id);
        return response()->json([
            'message' => 'Xóa hồ sơ trữ đông thành công'
        ], 200);
    }
}