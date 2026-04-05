<?php

namespace App\Services;

use App\DTOs\Requests\CreateEmbryoRecordRequestDTO;
use App\DTOs\Responses\EmbryoRecordResponseDTO;
use App\DTOs\Requests\update\UpdateEmbryoRecordRequestDTO;
use App\Repositories\Contracts\EmbryoRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;

class EmbryoRecordService
{
    public function __construct(protected EmbryoRecordRepositoryInterface $repository) {}

    public function createEmbryo(CreateEmbryoRecordRequestDTO $dto): EmbryoRecordResponseDTO
    {
        return DB::transaction(function () use ($dto) {
            $embryo = $this->repository->create([
                'treatment_id'       => $dto->treatment_id,
                'embryo_code'        => $dto->embryo_code,
                'fertilization_date' => $dto->fertilization_date,
                'development_day'    => $dto->development_day,
                'grade'              => $dto->grade,
                'status'             => $dto->status,
                'notes'              => $dto->notes,
            ]);
            return EmbryoRecordResponseDTO::fromModel($embryo);
        });
    }
    public function updateEmbryo(int $id, UpdateEmbryoRecordRequestDTO $dto): EmbryoRecordResponseDTO
    {
        return DB::transaction(function () use ($id, $dto) {
            $data = array_filter((array) $dto, fn($value) => !is_null($value));
            $embryo = $this->repository->update($id, $data);
            return EmbryoRecordResponseDTO::fromModel($embryo);
        });
    }
}