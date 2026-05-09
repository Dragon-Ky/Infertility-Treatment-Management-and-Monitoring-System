<?php

namespace App\Services;

use App\DTOs\Responses\TreatmentEventResponseDTO;
use App\Repositories\Contracts\TreatmentEventRepositoryInterface;

class TreatmentEventService extends BaseService
{
    protected function getCacheKeyPrefix(): string { return 'treatment_event'; }
    public function getResponseDtoClass(): string { return TreatmentEventResponseDTO::class; }

    public function __construct(TreatmentEventRepositoryInterface $eventRepository)
    {
        parent::__construct($eventRepository);
    }

    /**
     * Hàm lấy Timeline (Vẫn giữ lại vì đây là logic nghiệp vụ riêng)
     */
    public function getEventsByTreatment(int $treatmentId): array
    {
        $events = $this->repository->findByAttributes([
            'treatment_id' => $treatmentId,
            'is_active' => true
        ]);
        
        $dtoClass = $this->getResponseDtoClass();
        return array_map(fn($event) => $dtoClass::fromModel($event)->toArray(), $events->all());
    }
}