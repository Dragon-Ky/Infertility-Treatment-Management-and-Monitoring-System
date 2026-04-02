<?php

namespace App\DTOs\Requests;

readonly class CreateLabResultRequestDTO
{
    public function __construct(
        public int $protocol_id,
        public string $test_name,
        public string $result_value,
        public string $unit,
        public ?string $interpretation = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            protocol_id: $data['protocol_id'],
            test_name: $data['test_name'],
            result_value: $data['result_value'],
            unit: $data['unit'],
            interpretation: $data['interpretation'] ?? null,
        );
    }
}