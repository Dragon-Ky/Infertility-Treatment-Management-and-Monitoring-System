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
}