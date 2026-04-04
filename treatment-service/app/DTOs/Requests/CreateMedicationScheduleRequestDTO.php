<?php

namespace App\DTOs\Requests;

readonly class CreateMedicationScheduleRequestDTO
{
    public function __construct(
        public int $treatment_id,
        public string $medication_name,
        public string $dosage,
        public string $frequency,
        public string $start_date,
        public string $end_date,
        public array $time_slots,
        public string $route,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            treatment_id: $data['treatment_id'],
            medication_name: $data['medication_name'],
            dosage: $data['dosage'],
            frequency: $data['frequency'],
            start_date: $data['start_date'],
            end_date: $data['end_date'],
            time_slots: $data['time_slots'],
            route: $data['route'],
        );
    }
}