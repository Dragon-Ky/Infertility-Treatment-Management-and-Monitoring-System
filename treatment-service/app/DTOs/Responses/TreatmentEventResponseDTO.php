<?php

namespace App\DTOs\Responses;

use App\Models\TreatmentEvent;
use Carbon\Carbon;

readonly class TreatmentEventResponseDTO
{
    public function __construct(
        public int $id,
        public string $event_type,
        public string $title,
        public string $event_datetime_formatted,
        public ?string $result_summary,
        public ?string $location
    ) {}

    public static function fromModel(TreatmentEvent $event): self
    {
        return new self(
            id: $event->id,
            event_type: ucfirst($event->event_type),
            title: $event->title,
            event_datetime_formatted: Carbon::parse($event->event_datetime)->format('d/m/Y H:i'),
            result_summary: $event->result_summary,
            location: $event->location
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'event_type' => $this->event_type,
            'title' => $this->title,
            'event_datetime' => $this->event_datetime_formatted,
            'result_summary' => $this->result_summary,
            'location' => $this->location,
        ];
    }
}