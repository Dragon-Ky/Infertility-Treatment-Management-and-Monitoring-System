<?php

namespace App\DTOs\Responses;

use App\Models\TreatmentProtocol;

readonly class TreatmentProtocolResponseDTO
{
    public function __construct(
        public int $id,              
        public int $treatment_id,
        public int $doctor_id,
        public string $protocol_name,
        public ?string $diagnosis,
        public ?string $prescription,
        public ?string $notes,
        public string $created_at_formatted,
        public bool $is_active,
    ) {}

    public static function fromModel(TreatmentProtocol $protocol): self
    {
        return new self(
            id: $protocol->id,
            treatment_id: $protocol->treatment_id,
            doctor_id: $protocol->doctor_id,
            protocol_name: $protocol->protocol_name,
            diagnosis: $protocol->diagnosis,
            prescription: $protocol->prescription,
            notes: $protocol->notes,
            created_at_formatted: $protocol->created_at->format('d/m/Y H:i'),
            is_active: $protocol->is_active,
            
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'treatment_id' => $this->treatment_id,
            'doctor_id' => $this->doctor_id,
            'protocol_name' => $this->protocol_name,
            'diagnosis' => $this->diagnosis,
            'prescription' => $this->prescription,
            'notes' => $this->notes,
            'created_at' => $this->created_at_formatted,
            'is_active' => $this->is_active,
        ];
    }
}