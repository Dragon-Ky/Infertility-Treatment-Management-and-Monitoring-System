<?php

namespace App\Services;

use App\DTOs\Requests\CreateTreatmentProtocolRequestDTO;
use App\DTOs\Responses\TreatmentProtocolResponseDTO;
use App\Repositories\Contracts\TreatmentProtocolRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TreatmentProtocolService
{
    public function __construct(protected TreatmentProtocolRepositoryInterface $repository) {}

    public function createProtocol(CreateTreatmentProtocolRequestDTO $dto): TreatmentProtocolResponseDTO
    {
        DB::beginTransaction();
        try {
            $protocol = $this->repository->create([
                'treatment_id' => $dto->treatment_id,
                'doctor_id'    => $dto->doctor_id,
                'protocol_name'=> $dto->protocol_name,
                'diagnosis'    => $dto->diagnosis,
                'prescription' => $dto->prescription,
                'notes'        => $dto->notes,
            ]);
            DB::commit();
            return TreatmentProtocolResponseDTO::fromModel($protocol);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    // TreatmentProtocolService.php
    public function updateProtocol(int $id, UpdateRequestDTO $dto): ResponseDTO
    {
        // Gọi hàm update từ BaseService
        $protocol = $this->update($id, $dto->toArray()); 
        
        return ResponseDTO::fromModel($protocol);
    }
}