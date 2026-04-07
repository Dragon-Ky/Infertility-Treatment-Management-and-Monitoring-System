<?php

namespace App\Repositories\Eloquent;

use App\Models\MedicationRecord;
use App\Repositories\Contracts\MedicationRecordRepositoryInterface;

class MedicationRecordRepository extends BaseRepository implements MedicationRecordRepositoryInterface
{
    // Tiêm chính xác Model MedicationRecord vào BaseRepository thông qua hàm construct của PHP
    public function __construct(MedicationRecord $model)
    {
        parent::__construct($model);
    }
    public function getRecordWithSchedule(int $id)
    {
        // "with" sẽ đi tìm hàm medicationSchedule() trong Model MedicationRecord
        return $this->model->with('medicationSchedule')->find($id);
    }
}