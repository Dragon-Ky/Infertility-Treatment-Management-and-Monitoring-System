<?php

namespace App\Services;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Support\Facades\DB;

abstract class BaseService
{
    protected BaseRepositoryInterface $repository;

    public function __construct(BaseRepositoryInterface $repository)
    {
        $this->repository = $repository;
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
        return $this->repository->update($id, [
            'is_active' => false
        ]);
    }

    public function findById(int $id)
    {
        return $this->repository->find($id);
    }
    public function update(int $id, array $data)
    {
        // 1. Repository đã dùng findOrFail, nên nếu không có ID, nó sẽ văng lỗi ngay tại đây.
        // Bạn không cần kiểm tra if (!$updated) nữa.
        $this->repository->update($id, $data);

        // 2. Trả về item đã được cập nhật bằng cách gọi hàm tìm kiếm có sẵn
        return $this->findById($id);
    }
    abstract protected function getResponseDtoClass(): string;
    public function getAllActive(): array
    {
        // 1. Lấy danh sách từ Repository
        $items = $this->repository->findByAttributes(['is_active' => true]);

        // 2. Lấy tên cái "Hộp quà" mà Service con đã khai báo
        $dtoClass = $this->getResponseDtoClass();

        $result = [];
        foreach ($items as $item) {
            // 3. Dùng tên lớp DTO đó để đóng gói
            // PHP cho phép dùng biến $dtoClass để gọi hàm static: $dtoClass::fromModel()
            $result[] = $dtoClass::fromModel($item)->toArray();
        }

        return $result;
    }
}