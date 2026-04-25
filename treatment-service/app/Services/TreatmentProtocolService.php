<?php

namespace App\Services;

use App\DTOs\Responses\TreatmentProtocolResponseDTO;
use App\Repositories\Contracts\TreatmentProtocolRepositoryInterface;

use Illuminate\Support\Facades\DB;

class TreatmentProtocolService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'treatment_protocol'; }
    public function getResponseDtoClass(): string { return TreatmentProtocolResponseDTO::class; }

    public function __construct(TreatmentProtocolRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Override createFromDto để tự động sinh mã phác đồ
     */
    public function createFromDto(object $dto)
    {
        return DB::transaction(function () use ($dto) {
            $data = (array) $dto;
            
            // Tự động sinh mã phác đồ (Ví dụ: PHD-20240425-ABCD)
            $data['protocol_code'] = 'PHD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

            if (!isset($data['is_active'])) {
                $data['is_active'] = true;
            }

            $model = $this->repository->create($data);
            
            $this->clearCache($model->id);
            
            $dtoClass = $this->getResponseDtoClass();
            return $dtoClass::fromModel($model);
        });
    }
}