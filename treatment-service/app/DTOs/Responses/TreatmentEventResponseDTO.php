<?php
namespace App\DTOs\Responses;

use App\Models\TreatmentEvent;

readonly class TreatmentEventResponseDTO {
    public function __construct(
        public int $id,
        public string $event_type,
        public string $event_date_formatted,
        public ?string $result,
        public array $attachments
    ) {}

    public static function fromModel(TreatmentEvent $event): self {
        return new self(
            id: $event->id,
            event_type: $event->event_type,
            event_date_formatted: $event->event_date->format('d/m/Y H:i'),
            result: $event->result,
            attachments: $event->attachments ?? []
        );
    }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'event_type' => $this->event_type,
            'event_date' => $this->event_date_formatted,
            'result' => $this->result,
            'attachments' => $this->attachments,
        ];
    }
}