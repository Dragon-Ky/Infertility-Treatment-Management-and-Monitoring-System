<?php

namespace App\DTOs\Responses;

use App\Models\LabResult;

readonly class LabResultResponseDTO
{
    public function __construct(
        public int $id,
        public string $test_name,
        public string $result_display, // Gộp giá trị và đơn vị
        public ?string $interpretation
    ) {}

    public static function fromModel(LabResult $lab): self
    {
        return new self(
            id: $lab->id,
            test_name: $lab->test_name,
            result_display: $lab->result_value . ' ' . $lab->unit, // VD: "2.5 ng/ml"
            interpretation: $lab->interpretation
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'test_name' => $this->test_name,
            'result_display' => $this->result_display,
            'interpretation' => $this->interpretation,
        ];
    }
}