<?php

namespace App\Services;

use App\DTOs\Requests\CreateTreatmentProtocolRequestDTO;
use App\DTOs\Requests\update\UpdateTreatmentProtocolRequestDTO;

use App\DTOs\Responses\TreatmentProtocolResponseDTO;
use App\Repositories\Contracts\TreatmentProtocolRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class TreatmentProtocolService extends BaseService
{
    protected function getCacheKeyPrefix(): string
    {
        return 'treatment_protocol';
    }
    protected function getResponseDtoClass(): string
    {
        return TreatmentProtocolResponseDTO::class;
    }
    public function __construct(TreatmentProtocolRepositoryInterface $repository) 
    {
        parent::__construct($repository);
    }

    public function createProtocol(CreateTreatmentProtocolRequestDTO $dto): TreatmentProtocolResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $protocol = $this->repository->create([
                'treatment_id' => $dto->treatment_id,
                'doctor_id'    => $dto->doctor_id,
                'protocol_name'=> $dto->protocol_name,
                'diagnosis'    => $dto->diagnosis,
                'prescription' => $dto->prescription,
                'notes'        => $dto->notes,
                'is_active'    => true,
            ]);
            Cache::forget("treatment_protocol:all_active");
            return TreatmentProtocolResponseDTO::fromModel($protocol);
        });
    }
    
    public function updateProtocol(int $id, UpdateTreatmentProtocolRequestDTO $dto): TreatmentProtocolResponseDTO
    {
        return $this->updateWithDto($id, $dto);
    }
    public function deleteProtocol(int $id): bool
    {
        // Thay vì xóa vĩnh viễn, ta cập nhật trạng thái thành false
        return $this->delete($id);  
    }
    public function getProtocolById(int $id): TreatmentProtocolResponseDTO
    {
        $protocol = $this->repository->find($id);
        return TreatmentProtocolResponseDTO::fromModel($protocol);
    }
    
}