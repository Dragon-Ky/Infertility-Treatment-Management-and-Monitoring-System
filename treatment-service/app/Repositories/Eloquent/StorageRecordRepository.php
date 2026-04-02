<?php

namespace App\Repositories\Eloquent;

use App\Models\StorageRecord;
use App\Repositories\Contracts\StorageRecordRepositoryInterface;

class StorageRecordRepository extends BaseRepository implements StorageRecordRepositoryInterface
{
    // Tiêm chính xác Model StorageRecord vào BaseRepository thông qua hàm construct của PHP
    public function __construct(StorageRecord $model)
    {
        parent::__construct($model);
    }
}