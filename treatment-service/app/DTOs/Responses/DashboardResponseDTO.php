<?php

namespace App\DTOs\Responses;

readonly class DashboardResponseDTO
{
    public function __construct(
        public array $summary,
        public array $charts,
        public array $upcoming,
    ) {
    }

    public static function fromData(array $summary, array $charts, array $upcoming): self
    {
        return new self(
            summary: $summary,
            charts: $charts,
            upcoming: $upcoming,
        );
    }

    public function toArray(): array
    {
        return [
            'summary' => $this->summary,
            'charts' => $this->charts,
            'upcoming' => $this->upcoming,
        ];
    }
}
