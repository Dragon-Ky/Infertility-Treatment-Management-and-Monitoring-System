<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Hàm bind liên kết Interface với Class thực thi.
        // Khi hệ thống yêu cầu Interface bên trái, Laravel sẽ trả về Class bên phải.
        
        $this->app->bind(
            \App\Repositories\Contracts\TreatmentProtocolRepositoryInterface::class,
            \App\Repositories\Eloquent\TreatmentProtocolRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\TreatmentEventRepositoryInterface::class,
            \App\Repositories\Eloquent\TreatmentEventRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\EmbryoRecordRepositoryInterface::class,
            \App\Repositories\Eloquent\EmbryoRecordRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\LabResultRepositoryInterface::class,
            \App\Repositories\Eloquent\LabResultRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\MedicationScheduleRepositoryInterface::class,
            \App\Repositories\Eloquent\MedicationScheduleRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\MedicationRecordRepositoryInterface::class,
            \App\Repositories\Eloquent\MedicationRecordRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\PregnancyTrackingRepositoryInterface::class,
            \App\Repositories\Eloquent\PregnancyTrackingRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\StorageRecordRepositoryInterface::class,
            \App\Repositories\Eloquent\StorageRecordRepository::class
        );
    }

    public function boot(): void
    {
        // Không xử lý logic ở đây
    }
}