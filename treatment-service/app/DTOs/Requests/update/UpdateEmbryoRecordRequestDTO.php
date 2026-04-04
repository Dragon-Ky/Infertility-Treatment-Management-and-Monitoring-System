<?php
namespace App\DTOs\Requests;

readonly class UpdateEmbryoRecordRequestDTO
{
    public function __construct(
        public ?int $development_day = null,
        public ?string $grade = null,
        public ?string $status = null, // frozen|transferred|discarded
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            development_day: isset($data['development_day']) ? (int) $data['development_day'] : null,
            grade: $data['grade'] ?? null,
            status: $data['status'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }
}