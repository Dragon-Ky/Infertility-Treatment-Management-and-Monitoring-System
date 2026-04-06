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
        // 2. Bỏ dấu gạch chéo ngược \, chỉ dùng DB::transaction
        return DB::transaction(function () use ($id, $dto) {
            // Chuyển DTO thành mảng
            $dtoAsArray = (array) $dto;

            // Lọc bỏ các giá trị null (Người dùng không gửi thì không sửa)
            $data = array_filter($dtoAsArray, fn($value) => !is_null($value));

            // Gọi hàm update bên dưới
            $model = $this->update($id, $data);

            // Đóng gói kết quả trả về
            $dtoClass = $this->getResponseDtoClass();
            return $dtoClass::fromModel($model);
        });
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
        // Kiểm tra xem dữ liệu có tồn tại không trước khi sửa
        $item = $this->findById($id);
        if (!$item) {
            throw new \Exception("Không tìm thấy dữ liệu để cập nhật.");
        }

        return $this->repository->update($id, $data);
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