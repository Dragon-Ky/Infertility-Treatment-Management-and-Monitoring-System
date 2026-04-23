<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Microservices Configuration
    |--------------------------------------------------------------------------
    |
    | Danh sách các dịch vụ nội bộ mà Gateway sẽ quản lý và forward request tới.
    |
    */

    'gateway' => [
        'internal_secret' => env('GATEWAY_INTERNAL_SECRET', 'secret_key_default_123'),
    ],

    'microservices' => [
        'auth' => [
            'url' => env('AUTH_SERVICE_URL', 'http://auth-nginx'),
        ],
        'treatment' => [
            'url' => env('TREATMENT_SERVICE_URL', 'http://treatment-nginx'),
        ],
        'catalog' => [
            'url' => env('CATALOG_SERVICE_URL', 'http://catalog-nginx'),
        ],
        'appointment' => [
            'url' => env('APPOINTMENT_SERVICE_URL', 'http://appointment-nginx'),
        ],
        'notification' => [
            'url' => env('NOTIFICATION_SERVICE_URL', 'http://notification-nginx'),
        ],
        'report' => [
            'url' => env('REPORT_SERVICE_URL', 'http://report-nginx'),
        ],
    ],

];
