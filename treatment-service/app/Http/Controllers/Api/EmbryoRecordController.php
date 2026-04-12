<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\DTOs\Requests\CreateEmbryoRecordRequestDTO;
use App\DTOs\Requests\Update\UpdateEmbryoRecordRequestDTO;
use App\Services\EmbryoRecordService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EmbryoRecordController extends Controller
{
    public function __construct(protected EmbryoRecordService $embryoService)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'treatment_id' => 'required|integer',
            'embryo_code' => 'required|string|unique:embryo_records,embryo_code',
            'fertilization_date' => 'required|date',
            'development_day' => 'required|in:3,5,6',
            'grade' => 'required|string',
            'status' => 'required|in:frozen,transferred,discarded',
            'notes' => 'nullable|string',
        ]);

        $dto = CreateEmbryoRecordRequestDTO::fromArray($validated);
        $responseDTO = $this->embryoService->createEmbryo($dto);

        return response()->json([
            'message' => 'Lưu hồ sơ phôi thành công',
            'data' => $responseDTO->toArray()
        ], 201);
    }
    public function update(Request $request, int $id): JsonResponse
    {
        // 1. Kiểm tra dữ liệu gửi lên (Validation)
        // Lưu ý: Các trường ở đây nên là 'nullable' vì Update không bắt buộc gửi hết
        $validated = $request->validate([
            'development_day' => 'nullable|in:3,5,6',
            'grade' => 'nullable|string',
            'status' => 'nullable|in:frozen,transferred,discarded',
            'notes' => 'nullable|string',
        ]);

        // 2. Đóng gói vào DTO Update
        $dto = UpdateEmbryoRecordRequestDTO::fromArray($validated);

        // 3. Gọi Service xử lý
        $responseDTO = $this->embryoService->updateEmbryo($id, $dto);

        return response()->json([
            'message' => 'Cập nhật hồ sơ phôi thành công',
            'data' => $responseDTO->toArray()
        ], 200);
    }
    public function destroy(int $id): JsonResponse
    {
        $this->embryoService->deleteEmbryoRecord($id);
        return response()->json([
            'message' => 'Xóa hồ sơ phôi thành công'
        ], 200);
    }
    public function show(int $id): JsonResponse
    {
        try {
            $embryo = $this->embryoService->getEmbryoRecordById($id);
            return response()->json([
                'success' => true,
                'data' => $embryo->toArray()
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
}