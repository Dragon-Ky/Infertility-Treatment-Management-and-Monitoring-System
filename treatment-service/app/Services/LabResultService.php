<?php

namespace App\Services;

use App\DTOs\Requests\CreateLabResultRequestDTO;
use App\DTOs\Responses\LabResultResponseDTO;
use App\Repositories\Contracts\LabResultRepositoryInterface;
use Illuminate\Support\Facades\DB;

class LabResultService
{
    public function __construct(protected LabResultRepositoryInterface $repository) {}

    public function createLabResult(CreateLabResultRequestDTO $dto): LabResultResponseDTO
    {
        DB::beginTransaction();
        try {
            $lab = $this->repository->create([
                'treatment_id'    => $dto->treatment_id,
                'test_type'       => $dto->test_type,
                'test_date'       => $dto->test_date,
                'result_data'     => $dto->result_data,
                'reference_range' => $dto->reference_range,
                'unit'            => $dto->unit,
                'notes'           => $dto->notes,
                'doctor_notes'    => $dto->doctor_notes,
                'attachments'     => $dto->attachments,
            ]);
            DB::commit();
            return LabResultResponseDTO::fromModel($lab);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}