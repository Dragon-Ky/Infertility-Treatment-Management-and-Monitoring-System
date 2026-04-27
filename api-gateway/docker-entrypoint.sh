#!/bin/bash

# Install dependencies if vendor doesn't exist
if [ ! -d "vendor" ]; then
    composer install --no-interaction --optimize-autoloader
fi

# Generate key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate
fi

exec "$@"
