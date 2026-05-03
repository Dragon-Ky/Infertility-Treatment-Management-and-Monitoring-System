<?php

namespace App\DTOs\Requests;

readonly class CreateTreatmentProtocolRequestDTO
{
    public function __construct(
        public int $treatment_id,
        public int $doctor_id,
        public string $protocol_name,
        public ?string $diagnosis = null,
        public ?string $prescription = null,
        public ?string $notes = null,
        public ?string $status = 'in_progress',
        public ?int $price = 0,
    ) {}

    public static function fromArray(array $data): self
    {
        // Sửa các key bên trong mảng $data cho khớp với Controller/Form
        return new self(
            treatment_id: $data['treatment_id'],
            doctor_id: $data['doctor_id'],
            protocol_name: $data['protocol_name'],
            diagnosis: $data['diagnosis'] ?? null,
            prescription: $data['prescription'] ?? null,
            notes: $data['notes'] ?? null,
            status: $data['status'] ?? 'in_progress',
            price: isset($data['price']) ? (int) $data['price'] : 0,
        );
    }
}
