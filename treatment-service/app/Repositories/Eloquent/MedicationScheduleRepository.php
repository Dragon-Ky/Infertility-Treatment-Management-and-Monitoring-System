<?php

namespace App\Repositories\Eloquent;

use App\Models\MedicationSchedule;
use App\Repositories\Contracts\MedicationScheduleRepositoryInterface;

class MedicationScheduleRepository extends BaseRepository implements MedicationScheduleRepositoryInterface
{
    // Tiêm chính xác Model MedicationSchedule vào BaseRepository thông qua hàm construct của PHP
    public function __construct(MedicationSchedule $model)
    {
        parent::__construct($model);
    }
}