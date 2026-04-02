<?php

namespace App\DTOs\Requests;

readonly class CreateTreatmentProtocolRequestDTO
{
    public function __construct(
        public int $patient_id,
        public int $doctor_id,
        public string $name,
        public ?string $start_date = null,
        public ?string $end_date = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            patient_id: $data['patient_id'],
            doctor_id: $data['doctor_id'],
            name: $data['name'],
            start_date: $data['start_date'] ?? null,
            end_date: $data['end_date'] ?? null,
        );
    }
}