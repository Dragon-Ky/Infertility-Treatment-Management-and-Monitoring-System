<?php

namespace App\DTOs\Responses;

use App\Models\EmbryoRecord;

readonly class EmbryoRecordResponseDTO
{
    public function __construct(
        public int $id,
        public string $embryo_code,
        public string $fertilization_date_formatted,
        public int $development_day,
        public string $grade,
        public string $status_label,
        public ?string $notes
    ) {}

    public static function fromModel(EmbryoRecord $embryo): self
    {
        return new self(
            id: $embryo->id,
            embryo_code: strtoupper($embryo->embryo_code),
            fertilization_date_formatted: $embryo->fertilization_date->format('d/m/Y'),
            development_day: $embryo->development_day,
            grade: $embryo->grade,
            status_label: ucfirst($embryo->status),
            notes: $embryo->notes
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'embryo_code' => $this->embryo_code,
            'fertilization_date' => $this->fertilization_date_formatted,
            'development_day' => $this->development_day,
            'grade' => $this->grade,
            'status' => $this->status_label,
            'notes' => $this->notes,
        ];
    }
}