<?php

namespace App\DTOs\Responses;

use App\Models\MedicationSchedule;
use Carbon\Carbon;

readonly class MedicationScheduleResponseDTO
{
    public function __construct(
        public int $id,
        public string $medicine_name,
        public string $dosage,
        public string $scheduled_at_formatted,
        public string $route
    ) {}

    public static function fromModel(MedicationSchedule $schedule): self
    {
        return new self(
            id: $schedule->id,
            medicine_name: $schedule->medicine_name,
            dosage: $schedule->dosage,
            scheduled_at_formatted: Carbon::parse($schedule->scheduled_at)->format('d/m/Y H:i'),
            route: $schedule->route
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'medicine_name' => $this->medicine_name,
            'dosage' => $this->dosage,
            'scheduled_time' => $this->scheduled_at_formatted,
            'route' => $this->route,
        ];
    }
}