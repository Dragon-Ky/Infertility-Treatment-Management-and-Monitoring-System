<?php
namespace App\DTOs\Requests;

readonly class UpdatePregnancyTrackingRequestDTO
{
    public function __construct(
        public ?int $week_number = null,
        public ?string $status = null, // ongoing|delivered|miscarried
        public ?string $notes = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            week_number: isset($data['week_number']) ? (int) $data['week_number'] : null,
            status: $data['status'] ?? null,
            notes: $data['notes'] ?? null,
        );
    }
}