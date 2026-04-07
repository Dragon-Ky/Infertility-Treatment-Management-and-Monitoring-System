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
            $dtoAsArray = (array) $dto;
            $data = array_filter($dtoAsArray, fn($value) => !is_null($value));

            $model = $this->update($id, $data);

            // KIỂM TRA: Nếu có quan hệ cần nạp, hãy nạp nó trước khi đóng gói DTO
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
        // 1. Thực hiện update và nhận về kết quả (thường là true/false hoặc Model)
        $updated = $this->repository->update($id, $data);

        // 2. Kiểm tra nếu không update được (do không tìm thấy ID)
        if (!$updated) {
            throw new \Exception("Không tìm thấy dữ liệu để cập nhật hoặc dữ liệu không thay đổi.");
        }

        // 3. Trả về item đã được cập nhật
        // Nếu Repository của bạn trả về bool, bạn chỉ cần gọi findById 1 lần duy nhất ở đây
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