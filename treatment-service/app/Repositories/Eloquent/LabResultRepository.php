<?php

namespace App\Repositories\Eloquent;

use App\Models\LabResult;
use App\Repositories\Contracts\LabResultRepositoryInterface;

class LabResultRepository extends BaseRepository implements LabResultRepositoryInterface
{
    // Tiêm chính xác Model LabResult vào BaseRepository thông qua hàm construct của PHP
    public function __construct(LabResult $model)
    {
        parent::__construct($model);
    }
}