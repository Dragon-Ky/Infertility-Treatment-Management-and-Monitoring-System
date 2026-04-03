<?php

namespace App\Services;

use App\DTOs\Requests\CreateTreatmentProtocolRequestDTO;
use App\DTOs\Responses\TreatmentProtocolResponseDTO;
use App\Repositories\Contracts\TreatmentProtocolRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TreatmentProtocolService extends BaseService
{
    public function __construct(TreatmentProtocolRepositoryInterface $protocolRepository)
    {
        parent::__construct($protocolRepository);
    }

    public function createProtocol(CreateTreatmentProtocolRequestDTO $dto): TreatmentProtocolResponseDTO
    {
        DB::beginTransaction();
        try {
            $protocol = $this->repository->create([
                'patient_id' => $dto->patient_id,
                'doctor_id' => $dto->doctor_id,
                'name' => $dto->name,
                'start_date' => $dto->start_date,
                'end_date' => $dto->end_date,
                'status' => 'pending', // Luôn pending khi mới tạo
            ]);
            DB::commit();
            return TreatmentProtocolResponseDTO::fromModel($protocol);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}