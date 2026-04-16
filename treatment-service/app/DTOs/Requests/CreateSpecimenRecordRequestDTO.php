<?php

namespace App\DTOs\Requests;

class CreateSpecimenRecordRequestDTO
{
    public function __construct(
        public int $treatment_id,
        public string $type,
        public string $specimen_code,
        public ?string $fertilization_date = null,
        public ?int $development_day = null,
        public ?string $grade = null,
        public string $status,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            treatment_id: $data['treatment_id'],
            type: $data['type'] ?? 'embryo',
            specimen_code: $data['specimen_code'],
            fertilization_date: $data['fertilization_date'] ?? null,
            development_day: isset($data['development_day']) ? (int) $data['development_day'] : null,
            grade: $data['grade'] ?? null,
            status: $data['status'] ?? 'fresh',
            notes: $data['notes'] ?? null,
        );
    }
}
