<?php

namespace App\Repositories\Eloquent;

use App\Models\EmbryoRecord;
use App\Repositories\Contracts\EmbryoRecordRepositoryInterface;

class EmbryoRecordRepository extends BaseRepository implements EmbryoRecordRepositoryInterface
{
    // Tiêm chính xác Model EmbryoRecord vào BaseRepository thông qua hàm construct của PHP
    public function __construct(EmbryoRecord $model)
    {
        parent::__construct($model);
    }
}