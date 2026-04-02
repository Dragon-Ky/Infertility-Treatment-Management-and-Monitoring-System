<?php

namespace App\DTOs\Requests;

readonly class CreateMedicationRecordRequestDTO
{
    public function __construct(
        public int $schedule_id,
        public string $administered_at,
        public int $staff_id,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            schedule_id: $data['schedule_id'],
            administered_at: $data['administered_at'],
            staff_id: $data['staff_id'],
            notes: $data['notes'] ?? null,
        );
    }
}