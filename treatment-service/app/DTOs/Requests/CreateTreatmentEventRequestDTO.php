<?php

namespace App\DTOs\Requests;

readonly class CreateTreatmentEventRequestDTO {
    public function __construct(
        public int $treatment_id,
        public string $event_type,
        public string $event_date,
        public ?string $description = null,
        public ?string $result = null,
        public ?string $doctor_notes = null,
        public array $attachments = [],
    ) {}

    public static function fromArray(array $data): self {
        return new self(
            treatment_id: $data['treatment_id'],
            event_type: $data['event_type'],
            event_date: $data['event_date'],
            description: $data['description'] ?? null,
            result: $data['result'] ?? null,
            doctor_notes: $data['doctor_notes'] ?? null,
            attachments: $data['attachments'] ?? [],
        );
    } 
}