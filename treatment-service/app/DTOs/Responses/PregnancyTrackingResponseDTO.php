<?php

namespace App\DTOs\Responses;

use App\Models\PregnancyTracking;

readonly class PregnancyTrackingResponseDTO
{
    public function __construct(
        public int $id,
        public int $treatment_id,
        public ?string $protocol_name,
        public string $tracking_date,
        public string $tracking_date_formatted,
        public int $week_number,
        public string $status,
        public string $status_label,
        public ?string $notes,
        public bool $is_active
    ) {
    }

    public static function fromModel(PregnancyTracking $tracking): self
    {
        return new self(
            id: $tracking->id,
            treatment_id: (int) $tracking->treatment_id,
            protocol_name: $tracking->treatmentProtocol->protocol_name ?? 'ID: ' . $tracking->treatment_id,
            tracking_date: $tracking->tracking_date->format('Y-m-d'),
            tracking_date_formatted: $tracking->tracking_date->format('d/m/Y'),
            week_number: $tracking->week_number,
            status: $tracking->status,
            status_label: ucfirst($tracking->status),
            notes: $tracking->notes,
            is_active: (bool) $tracking->is_active,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'treatment_id' => $this->treatment_id,
            'protocol_name' => $this->protocol_name,
            'tracking_date' => $this->tracking_date,
            'tracking_date_formatted' => $this->tracking_date_formatted,
            'week_number' => $this->week_number,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'notes' => $this->notes,
            'is_active' => $this->is_active,
        ];
    }
}