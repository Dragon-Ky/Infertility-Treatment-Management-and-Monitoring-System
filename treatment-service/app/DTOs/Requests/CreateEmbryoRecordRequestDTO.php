<?php

namespace App\DTOs\Requests;

readonly class CreateEmbryoRecordRequestDTO
{
    public function __construct(
        public int $treatment_id,
        public string $embryo_code,
        public string $fertilization_date,
        public int $development_day,
        public string $grade,
        public string $status,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            treatment_id: $data['treatment_id'],
            embryo_code: $data['embryo_code'],
            fertilization_date: $data['fertilization_date'],
            development_day: (int)$data['development_day'],
            grade: $data['grade'],
            status: $data['status'],
            notes: $data['notes'] ?? null,
        );
    }
}