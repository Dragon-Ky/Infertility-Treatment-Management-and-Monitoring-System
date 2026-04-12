<?php
namespace App\DTOs\Requests\Update;

readonly class UpdateTreatmentProtocolRequestDTO
{
    public function __construct(
        public ?int $doctor_id = null,
        public ?string $protocol_name = null,
        public ?string $diagnosis = null,
        public ?string $prescription = null,
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            doctor_id: $data['doctor_id'] ?? null,
            protocol_name: $data['protocol_name'] ?? null,
            diagnosis: $data['diagnosis'] ?? null,
            prescription: $data['prescription'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }
}