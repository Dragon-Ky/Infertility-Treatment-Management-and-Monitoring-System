<?php

namespace App\DTOs\Responses;

use App\Models\PregnancyTracking;

readonly class PregnancyTrackingResponseDTO
{
    public function __construct(
        public int $id,
        public string $tracking_date_formatted,
        public int $week_number,
        public string $status_label,
        public ?string $notes,
        public bool $is_active
    ) {}

    public static function fromModel(PregnancyTracking $tracking): self
    {
        return new self(
            id: $tracking->id,
            tracking_date_formatted: $tracking->tracking_date->format('d/m/Y'),
            week_number: $tracking->week_number,
            status_label: ucfirst($tracking->status),
            notes: $tracking->notes,
            is_active: $tracking->is_active,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'tracking_date' => $this->tracking_date_formatted,
            'week_number' => $this->week_number,
            'status' => $this->status_label,
            'notes' => $this->notes,
            'is_active' => $this->is_active,
        ];
    }
}