<?php

namespace App\DTOs\Requests;

readonly class CreatePregnancyTrackingRequestDTO
{
    public function __construct(
        public int $treatment_id,
        public string $tracking_date,
        public int $week_number,
        public string $status,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            treatment_id: $data['treatment_id'],
            tracking_date: $data['tracking_date'],
            week_number: (int) $data['week_number'],
            status: $data['status'],
            notes: $data['notes'] ?? null,
        );
    }
}