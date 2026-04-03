<?php

namespace App\Services;

use App\DTOs\Requests\CreateEmbryoRecordRequestDTO;
use App\DTOs\Responses\EmbryoRecordResponseDTO;
use App\Repositories\Contracts\EmbryoRecordRepositoryInterface;
use Illuminate\Support\Facades\DB;

class EmbryoRecordService extends BaseService
{
    public function __construct(EmbryoRecordRepositoryInterface $embryoRepository)
    {
        parent::__construct($embryoRepository);
    }

    public function createEmbryo(CreateEmbryoRecordRequestDTO $dto): EmbryoRecordResponseDTO
    {
        DB::beginTransaction();
        try {
            $embryo = $this->repository->create([
                'protocol_id' => $dto->protocol_id,
                'embryo_code' => $dto->embryo_code,
                'stage' => $dto->stage,
                'grade' => $dto->grade,
                'status' => $dto->status,
            ]);

            DB::commit();
            return EmbryoRecordResponseDTO::fromModel($embryo);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}