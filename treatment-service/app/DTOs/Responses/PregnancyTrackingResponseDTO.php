<?php

namespace App\DTOs\Responses;

use App\Models\PregnancyTracking;

readonly class PregnancyTrackingResponseDTO
{
    public function __construct(
        public int $id,
        public ?float $beta_hcg_level,
        public ?int $gestational_age_weeks,
        public ?string $fetal_heartbeat,
        public string $outcome_label
    ) {}

    public static function fromModel(PregnancyTracking $tracking): self
    {
        return new self(
            id: $tracking->id,
            beta_hcg_level: $tracking->beta_hcg_level ? (float) $tracking->beta_hcg_level : null,
            gestational_age_weeks: $tracking->gestational_age_weeks,
            fetal_heartbeat: $tracking->fetal_heartbeat,
            outcome_label: ucfirst(str_replace('_', ' ', $tracking->outcome)) // VD: "live_birth" -> "Live birth"
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'beta_hcg_level' => $this->beta_hcg_level,
            'gestational_age_weeks' => $this->gestational_age_weeks,
            'fetal_heartbeat' => $this->fetal_heartbeat,
            'outcome' => $this->outcome_label,
        ];
    }
}