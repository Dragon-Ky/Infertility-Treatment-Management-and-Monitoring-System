<?php
namespace App\DTOs\Requests;

readonly class UpdateLabResultRequestDTO
{
    public function __construct(
        public ?array $result_data = null,
        public ?string $notes = null,
        public ?string $doctor_notes = null,
        public ?array $attachments = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            result_data: $data['result_data'] ?? null,
            notes: $data['notes'] ?? null,
            doctor_notes: $data['doctor_notes'] ?? null,
            attachments: $data['attachments'] ?? null,
        );
    }
}