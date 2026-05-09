<?php
namespace App\DTOs\Responses;

use App\Models\TreatmentEvent;

readonly class TreatmentEventResponseDTO {
    public function __construct(
        public int $id,
        public int $treatment_id,
        public ?string $protocol_name,
        public string $event_type,
        public string $event_date,
        public string $event_date_formatted,
        public ?string $description,
        public ?string $result,
        public ?string $doctor_notes,
        public array $attachments,
        public bool $is_active,
    ) {}

    public static function fromModel(TreatmentEvent $event): self {
        return new self(
            id: $event->id,
            treatment_id: (int) $event->treatment_id,
            protocol_name: $event->treatmentProtocol->protocol_name ?? 'ID: ' . $event->treatment_id,
            event_type: $event->event_type,
            event_date: $event->event_date->format('Y-m-d\TH:i'),
            event_date_formatted: $event->event_date->format('d/m/Y H:i'),
            description: $event->description,
            result: $event->result,
            doctor_notes: $event->doctor_notes,
            attachments: $event->attachments ?? [],
            is_active: $event->is_active,
        );
    }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'treatment_id' => $this->treatment_id,
            'protocol_name' => $this->protocol_name,
            'event_type' => $this->event_type,
            'event_date' => $this->event_date,
            'event_date_formatted' => $this->event_date_formatted,
            'description' => $this->description,
            'result' => $this->result,
            'doctor_notes' => $this->doctor_notes,
            'attachments' => $this->attachments,
            'is_active' => $this->is_active,
        ];
    }
}