<?php

namespace App\Services;

use App\Repositories\Contracts\BaseRepositoryInterface;

abstract class BaseService
{
    protected BaseRepositoryInterface $repository;

    public function __construct(BaseRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
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
}