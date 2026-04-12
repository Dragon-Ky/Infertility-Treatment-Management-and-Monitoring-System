<?php
namespace App\DTOs\Requests\Update;

readonly class UpdateMedicationRecordRequestDTO
{
    public function __construct(
        public ?string $actual_time = null,
        public ?string $status = null, // taken|missed|skipped
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            actual_time: $data['actual_time'] ?? null,
            status: $data['status'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }
}