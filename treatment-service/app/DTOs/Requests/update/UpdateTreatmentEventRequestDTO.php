<?php
namespace App\DTOs\Requests;

readonly class UpdateTreatmentEventRequestDTO
{
    public function __construct(
        public ?string $description = null,
        public ?string $result = null,
        public ?string $doctor_notes = null,
        public ?array $attachments = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            description: $data['description'] ?? null,
            result: $data['result'] ?? null,
            doctor_notes: $data['doctor_notes'] ?? null,
            attachments: $data['attachments'] ?? null,
        );
    }
}