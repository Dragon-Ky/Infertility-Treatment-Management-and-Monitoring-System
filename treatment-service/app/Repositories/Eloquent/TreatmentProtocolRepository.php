<?php

namespace App\Repositories\Eloquent;

use App\Models\TreatmentProtocol;
use App\Repositories\Contracts\TreatmentProtocolRepositoryInterface;

class TreatmentProtocolRepository extends BaseRepository implements TreatmentProtocolRepositoryInterface
{
    // Tiêm chính xác Model TreatmentProtocol vào BaseRepository thông qua hàm construct của PHP
    public function __construct(TreatmentProtocol $model)
    {
        parent::__construct($model);
    }
}