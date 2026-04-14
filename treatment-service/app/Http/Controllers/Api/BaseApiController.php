<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BaseService;
use App\DTOs\Requests\SearchTreatmentRequestDTO;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

abstract class BaseApiController extends Controller
{
    protected BaseService $service;

    public function __construct(BaseService $service)
    {
        $this->service = $service;
    }

    /**
     * Khai báo các quy tắc bắt buộc cho Controller con
     */
    abstract protected function getStoreRules(): array;
    abstract protected function getUpdateRules(): array;
    abstract protected function getCreateDtoClass(): string;
    abstract protected function getUpdateDtoClass(): string;

    // GET: Lấy danh sách (Kèm tìm kiếm & Cache)
    public function index(Request $request): JsonResponse
    {
        $searchDto = SearchTreatmentRequestDTO::fromRequest($request);
        $data = $this->service->searchActive($searchDto->toArray());
        
        if (isset($data['current_page'])) {
            return response()->json($data, 200);
        }

        return response()->json(['data' => $data], 200);
    }

    // POST: Tạo mới dữ liệu
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->getStoreRules());
        $dtoClass = $this->getCreateDtoClass();
        
        $dto = $dtoClass::fromArray($validated);
        $response = $this->service->createFromDto($dto);

        return response()->json([
            'message' => 'Tạo mới thành công', 
            'data' => $response->toArray()
        ], 201);
    }

    // GET {id}: Xem chi tiết
    public function show(int $id): JsonResponse
    {
        $result = $this->service->findById($id);
        $dtoClass = $this->service->getResponseDtoClass();
        return response()->json(['data' => $dtoClass::fromModel($result)->toArray()], 200);
    }

    // PUT {id}: Cập nhật dữ liệu
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate($this->getUpdateRules());
        $dtoClass = $this->getUpdateDtoClass();
        
        $dto = $dtoClass::fromArray($validated);
        $response = $this->service->updateWithDto($id, $dto);

        return response()->json([
            'message' => 'Cập nhật thành công', 
            'data' => $response->toArray()
        ], 200);
    }

    // DELETE {id}: Xóa dữ liệu (Soft delete)
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Xóa thành công'], 200);
    }
}