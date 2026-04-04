<?php

namespace App\DTOs\Requests;

readonly class CreateMedicationRecordRequestDTO
{
    public function __construct(
        public int $medication_schedule_id,
        public string $scheduled_time,
        public string $actual_time,
        public string $status,
        public int $recorded_by,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            medication_schedule_id: $data['medication_schedule_id'],
            scheduled_time: $data['scheduled_time'],
            actual_time: $data['actual_time'],
            status: $data['status'],
            recorded_by: $data['recorded_by'],
            notes: $data['notes'] ?? null,
        );
    }
}