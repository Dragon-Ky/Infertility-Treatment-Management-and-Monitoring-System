<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Microservice URLs
    |--------------------------------------------------------------------------
    |
    | URLs for other microservices in the system
    |
    */

    'auth_service' => [
        'url' => env('AUTH_SERVICE_URL', 'http://auth-service:8000'),
    ],

    'catalog_service' => [
        'url' => env('CATALOG_SERVICE_URL', 'http://catalog-service:8000'),
    ],

    'appointment_service' => [
        'url' => env('APPOINTMENT_SERVICE_URL', 'http://appointment-service:8000'),
    ],

    'treatment_service' => [
        'url' => env('TREATMENT_SERVICE_URL', 'http://treatment-service:8000'),
    ],

    'notification_service' => [
        'url' => env('NOTIFICATION_SERVICE_URL', 'http://notification-service:8000'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache TTL Settings
    |--------------------------------------------------------------------------
    |
    | Cache time-to-live settings in seconds
    |
    */

    'dashboard_cache_ttl' => env('DASHBOARD_CACHE_TTL', 900),
    'report_cache_ttl' => env('REPORT_CACHE_TTL', 3600),
    'statistics_cache_ttl' => env('STATISTICS_CACHE_TTL', 3600),

    'gateway' => [
        'internal_secret' => env('GATEWAY_INTERNAL_SECRET'),
    ],

];
