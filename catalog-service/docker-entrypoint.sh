#!/bin/bash

# Wait for database to be ready using PHP (since it's already installed)
echo "Waiting for database..."
php -r "
    \$host = getenv('DB_HOST');
    \$port = getenv('DB_PORT') ?: 3306;
    while (true) {
        try {
            \$pdo = new PDO(\"mysql:host=\$host;port=\$port\", getenv('DB_USERNAME'), getenv('DB_PASSWORD'));
            exit(0);
        } catch (Exception \$e) {
            sleep(1);
        }
    }
"
echo "Database is up!"

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Execute the CMD
exec "$@"
