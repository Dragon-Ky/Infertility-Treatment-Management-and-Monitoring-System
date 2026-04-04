<?php
namespace App\DTOs\Requests;

readonly class UpdateMedicationScheduleRequestDTO
{
    public function __construct(
        public ?string $medication_name = null,
        public ?string $dosage = null,
        public ?string $frequency = null,
        public ?string $start_date = null,
        public ?string $end_date = null,
        public ?array $time_slots = null,
        public ?string $route = null,
        public ?string $status = null, // active|completed|paused
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            medication_name: $data['medication_name'] ?? null,
            dosage: $data['dosage'] ?? null,
            frequency: $data['frequency'] ?? null,
            start_date: $data['start_date'] ?? null,
            end_date: $data['end_date'] ?? null,
            time_slots: $data['time_slots'] ?? null,
            route: $data['route'] ?? null,
            status: $data['status'] ?? null,
        );
    }
}