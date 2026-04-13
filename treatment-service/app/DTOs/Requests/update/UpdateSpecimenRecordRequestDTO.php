<?php

namespace App\DTOs\Requests\update;

class UpdateSpecimenRecordRequestDTO
{
    public function __construct(
        public ?int $development_day = null,
        public ?string $grade = null,
        public ?string $status = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            development_day: $data['development_day'] ?? null,
            grade: $data['grade'] ?? null,
            status: $data['status'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }
}
