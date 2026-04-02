<?php

namespace App\DTOs\Requests;

readonly class CreateEmbryoRecordRequestDTO
{
    public function __construct(
        public int $protocol_id,
        public string $embryo_code,
        public string $stage,
        public string $grade,
        public string $status,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            protocol_id: $data['protocol_id'],
            embryo_code: $data['embryo_code'],
            stage: $data['stage'],
            grade: $data['grade'],
            status: $data['status'],
        );
    }
}