<?php

namespace App\Services;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
abstract class BaseService
{
    protected BaseRepositoryInterface $repository;
    protected int $cacheTtl = 3600;

    public function __construct(BaseRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }
    abstract protected function getCacheKeyPrefix(): string;

    public function createFromDto(object $dto)
    {
        return DB::transaction(function () use ($dto) {
            $data = (array) $dto;
            
            // Mặc định is_active = true khi tạo mới nếu không được truyền từ DTO
            if (!key_exists('is_active', $data)) {
                $data['is_active'] = true;
            }

            // Ghi dữ liệu vào Database thông qua Repository
            $model = $this->repository->create($data);
            
            // Xóa cache danh sách để dữ liệu mới được cập nhật ngay lập tức
            $this->clearCache($model->id);
            
            // Đóng gói vào DTO Response tương ứng
            $dtoClass = $this->getResponseDtoClass();
            return $dtoClass::fromModel($model);
        });
    }
    public function updateWithDto(int $id, object $dto)
    {
        return DB::transaction(function () use ($id, $dto) {
            // Chuyển DTO thành mảng và lọc bỏ các giá trị null (tránh ghi đè dữ liệu cũ bằng null)
            $data = array_filter((array) $dto, fn($value) => !is_null($value));

            // Gọi hàm update đã tối ưu ở trên
            $model = $this->update($id, $data);

            // Nạp các quan hệ nếu có (như MedicationSchedule)
            $relations = $this->getRelationsToLoad();
            if (!empty($relations)) {
                $model->load($relations);
            }

            $dtoClass = $this->getResponseDtoClass();
            return $dtoClass::fromModel($model);
        });
    }

    protected function getRelationsToLoad(): array
    {
        return [];
    }
    public function delete(int $id): bool
    {
        // 1. Kiểm tra xem dữ liệu có tồn tại không trước khi "xóa"
        $item = $this->findById($id);

        if (!$item) {
            throw new \Exception("Không tìm thấy dữ liệu để xóa.");
        }

        // 2. Cập nhật is_active thành false (Số 0 trong Database)
        $result = $this->repository->update($id, ['is_active' => false]);
        $this->clearCache($id);
        return $result;
    }

    public function findById(int $id)
    {
        $key = "{$this->getCacheKeyPrefix()}:{$id}";

        return Cache::remember($key, $this->cacheTtl, function () use ($id) {
            return $this->repository->find($id);
        });
    }
    public function update(int $id, array $data)
    {
        // 1. Repository đã dùng findOrFail, nên nếu không có ID, nó sẽ văng lỗi ngay tại đây.
        
        $this->repository->update($id, $data);

        $this->clearCache($id);

        // 2. Trả về item đã được cập nhật bằng cách gọi hàm tìm kiếm có sẵn
        return $this->findById($id);
    }


    abstract public function getResponseDtoClass(): string;
    public function getAllActive(): array
    {
        $key = "{$this->getCacheKeyPrefix()}:all_active";

        return Cache::remember($key, $this->cacheTtl, function () {
            $items = $this->repository->findByAttributes(['is_active' => true]);
            $dtoClass = $this->getResponseDtoClass();

            return array_map(fn($item) => $dtoClass::fromModel($item)->toArray(), $items->all());
        });
    }

    public function searchActive(array $searchParams = []): array
    {
        $items = $this->repository->search($searchParams, ['is_active' => true]);
        $dtoClass = $this->getResponseDtoClass();

        // Check against the concrete class to satisfy IDE static analysis
        if ($items instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            $items->setCollection(
                $items->getCollection()->map(fn($item) => $dtoClass::fromModel($item)->toArray())
            );
            return $items->toArray();
        }

        // Return array of DTOs from standard Eloquent Collection
        return collect($items)->map(fn($item) => $dtoClass::fromModel($item)->toArray())->toArray();
    }
    protected function clearCache(int $id): void
    {
        Cache::forget("{$this->getCacheKeyPrefix()}:{$id}");
        Cache::forget("{$this->getCacheKeyPrefix()}:all_active");
    }
    
}