<?php

namespace App\DTOs\Responses;

use App\Models\EmbryoRecord;

readonly class EmbryoRecordResponseDTO
{
    public function __construct(
        public int $id,
        public string $embryo_code,
        public string $stage,
        public string $grade,
        public string $status_label
    ) {}

    public static function fromModel(EmbryoRecord $embryo): self
    {
        return new self(
            id: $embryo->id,
            embryo_code: strtoupper($embryo->embryo_code), // Đảm bảo mã phôi luôn in hoa (VD: P01)
            stage: $embryo->stage,
            grade: $embryo->grade,
            status_label: ucfirst($embryo->status)
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'embryo_code' => $this->embryo_code,
            'stage' => $this->stage,
            'grade' => $this->grade,
            'status' => $this->status_label,
        ];
    }
}