<?php

namespace App\Repositories\Eloquent;

use App\Models\PregnancyTracking;
use App\Repositories\Contracts\PregnancyTrackingRepositoryInterface;

class PregnancyTrackingRepository extends BaseRepository implements PregnancyTrackingRepositoryInterface
{
    // Tiêm chính xác Model PregnancyTracking vào BaseRepository thông qua hàm construct của PHP
    public function __construct(PregnancyTracking $model)
    {
        parent::__construct($model);
    }
}