<?php

namespace App\DTOs\Requests;

readonly class CreatePregnancyTrackingRequestDTO
{
    public function __construct(
        public int $protocol_id,
        public string $outcome,
        public ?float $beta_hcg_level = null, // Ép kiểu float cho decimal
        public ?int $gestational_age_weeks = null,
        public ?string $fetal_heartbeat = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            protocol_id: $data['protocol_id'],
            outcome: $data['outcome'],
            beta_hcg_level: isset($data['beta_hcg_level']) ? (float) $data['beta_hcg_level'] : null,
            gestational_age_weeks: isset($data['gestational_age_weeks']) ? (int) $data['gestational_age_weeks'] : null,
            fetal_heartbeat: $data['fetal_heartbeat'] ?? null,
        );
    }
}