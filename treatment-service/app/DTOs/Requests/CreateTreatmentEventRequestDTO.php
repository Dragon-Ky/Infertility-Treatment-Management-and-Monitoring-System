<?php

namespace App\DTOs\Requests;

readonly class CreateTreatmentEventRequestDTO
{
    public function __construct(
        public int $protocol_id,
        public string $event_type,
        public string $title,
        public string $event_datetime,
        public ?string $result_summary = null,
        public ?string $location = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            protocol_id: $data['protocol_id'],
            event_type: $data['event_type'],
            title: $data['title'],
            event_datetime: $data['event_datetime'],
            result_summary: $data['result_summary'] ?? null,
            location: $data['location'] ?? null,
        );
    }
}