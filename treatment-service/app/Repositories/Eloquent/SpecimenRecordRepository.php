<?php

namespace App\Repositories\Eloquent;

use App\Models\SpecimenRecord;
use App\Repositories\Contracts\SpecimenRecordRepositoryInterface;

class SpecimenRecordRepository extends BaseRepository implements SpecimenRecordRepositoryInterface
{
    public function __construct(SpecimenRecord $model)
    {
        parent::__construct($model);
    }
}
