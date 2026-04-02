<?php

namespace App\DTOs\Responses;

use App\Models\TreatmentProtocol;

readonly class TreatmentProtocolResponseDTO
{
    public function __construct(
        public int $id,
        public int $patient_id,
        public string $name,
        public string $status_label,
        public string $created_at_formatted
    ) {}

    public static function fromModel(TreatmentProtocol $protocol): self
    {
        return new self(
            id: $protocol->id,
            patient_id: $protocol->patient_id,
            name: $protocol->name,
            status_label: ucfirst($protocol->status), 
            created_at_formatted: $protocol->created_at->format('d/m/Y H:i') 
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'protocol_name' => $this->name,
            'status' => $this->status_label,
            'created_at' => $this->created_at_formatted,
        ];
    }
}