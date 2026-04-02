<?php

namespace App\DTOs\Requests;

readonly class CreateMedicationScheduleRequestDTO
{
    public function __construct(
        public int $protocol_id,
        public string $medicine_name,
        public string $dosage,
        public string $scheduled_at,
        public string $route,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            protocol_id: $data['protocol_id'],
            medicine_name: $data['medicine_name'],
            dosage: $data['dosage'],
            scheduled_at: $data['scheduled_at'],
            route: $data['route'],
        );
    }
}