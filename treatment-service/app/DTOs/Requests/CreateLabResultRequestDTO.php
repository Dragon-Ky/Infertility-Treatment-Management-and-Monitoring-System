<?php

namespace App\DTOs\Requests;

readonly class CreateLabResultRequestDTO
{
    public function __construct(
        public int $treatment_id,
        public string $test_type,
        public string $test_date,
        public array $result_data,
        public ?string $reference_range = null,
        public ?string $unit = null,
        public ?string $notes = null,
        public ?string $doctor_notes = null,
        public array $attachments = [],
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            treatment_id: $data['treatment_id'],
            test_type: $data['test_type'],
            test_date: $data['test_date'],
            result_data: $data['result_data'],
            reference_range: $data['reference_range'] ?? null,
            unit: $data['unit'] ?? null,
            notes: $data['notes'] ?? null,
            doctor_notes: $data['doctor_notes'] ?? null,
            attachments: $data['attachments'] ?? [],
        );
    }
}