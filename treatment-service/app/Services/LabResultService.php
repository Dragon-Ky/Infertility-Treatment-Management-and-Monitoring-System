<?php

namespace App\Services;

use App\DTOs\Requests\CreateLabResultRequestDTO;
use App\DTOs\Responses\LabResultResponseDTO;
use App\Repositories\Contracts\LabResultRepositoryInterface;
use Illuminate\Support\Facades\DB;

class LabResultService extends BaseService
{
    public function __construct(LabResultRepositoryInterface $labRepository)
    {
        parent::__construct($labRepository);
    }

    public function createLabResult(CreateLabResultRequestDTO $dto): LabResultResponseDTO
    {
        DB::beginTransaction();
        try {
            $lab = $this->repository->create([
                'protocol_id' => $dto->protocol_id,
                'test_name' => $dto->test_name,
                'result_value' => $dto->result_value,
                'unit' => $dto->unit,
                'interpretation' => $dto->interpretation,
            ]);
            DB::commit();
            return LabResultResponseDTO::fromModel($lab);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}