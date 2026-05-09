<?php

// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'], // Cho phép GET, POST, PUT, DELETE...

    'allowed_origins' => ['*'], // Sửa chỗ này thành dấu * (Hoặc cụ thể là ['http://localhost:5174'])

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false, // Chú ý: Nếu dùng cookie/session thì đổi thành true, và allowed_origins không được để *
];