<?php

namespace App\DTOs\Responses;

use App\Models\TreatmentProtocol;

readonly class TreatmentProtocolResponseDTO
{
    public function __construct(
        public int $id,
        public ?string $protocol_code,
        public int $treatment_id,
        public int $doctor_id,
        public string $protocol_name,
        public ?string $diagnosis,
        public ?string $prescription,
        public ?string $notes,
        public string $created_at_formatted,
        public bool $is_active,
        public string $status,
        public int $price,
    ) {}

    public static function fromModel(TreatmentProtocol $protocol): self
    {
        return new self(
            id: $protocol->id,
            protocol_code: $protocol->protocol_code,
            treatment_id: $protocol->treatment_id,
            doctor_id: $protocol->doctor_id,
            protocol_name: $protocol->protocol_name,
            diagnosis: $protocol->diagnosis,
            prescription: $protocol->prescription,
            notes: $protocol->notes,
            created_at_formatted: $protocol->created_at->format('d/m/Y H:i'),
            is_active: (bool) $protocol->is_active,
            status: $protocol->status ?? 'in_progress',
            price: (int) ($protocol->price ?? 0),

        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'protocol_code' => $this->protocol_code,
            'treatment_id' => $this->treatment_id,
            'doctor_id' => $this->doctor_id,
            'protocol_name' => $this->protocol_name,
            'diagnosis' => $this->diagnosis,
            'prescription' => $this->prescription,
            'notes' => $this->notes,
            'created_at' => $this->created_at_formatted,
            'is_active' => $this->is_active,
            'status' => $this->status,
            'price' => $this->price,
        ];
    }
}
