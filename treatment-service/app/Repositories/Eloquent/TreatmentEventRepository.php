<?php

namespace App\Repositories\Eloquent;

use App\Models\TreatmentEvent;
use App\Repositories\Contracts\PregnancyTrackingRepositoryInterface;

class TreatmentEventRepository extends BaseRepository implements PregnancyTrackingRepositoryInterface
{
    // Tiêm chính xác Model TreatmentEvent vào BaseRepository thông qua hàm construct của PHP
    public function __construct(TreatmentEvent $model)
    {
        parent::__construct($model);
    }
}