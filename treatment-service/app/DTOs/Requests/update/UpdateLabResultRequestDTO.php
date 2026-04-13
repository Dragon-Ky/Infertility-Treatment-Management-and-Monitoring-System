<?php
namespace App\DTOs\Requests\Update;

readonly class UpdateLabResultRequestDTO
{
    public function __construct(
        public ?array $result_data = null,
        public ?string $doctor_notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            result_data: $data['result_data'] ?? null,
            doctor_notes: $data['doctor_notes'] ?? null,
        );
    }
}