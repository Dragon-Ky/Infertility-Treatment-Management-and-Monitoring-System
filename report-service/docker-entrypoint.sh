#!/bin/bash

set -e

# Wait for database to be ready
echo "Waiting for database ($DB_HOST:$DB_PORT)..."
php -r "
    \$host = getenv('DB_HOST');
    \$port = getenv('DB_PORT') ?: 3306;
    \$user = getenv('DB_USERNAME');
    \$pass = getenv('DB_PASSWORD');
    while (true) {
        try {
            \$pdo = new PDO(\"mysql:host=\$host;port=\$port\", \$user, \$pass);
            exit(0);
        } catch (Exception \$e) {
            echo \"Database not ready yet... \" . \$e->getMessage() . \"\n\";
            sleep(2);
        }
    }
"
echo "Database is up!"

# Ensure vendor directory exists
if [ ! -d "vendor" ]; then
    echo "Vendor directory not found. Please run composer install."
fi

# Run migrations and seeders
echo "Running migrations and seeders for $DB_DATABASE..."
# Use migrate:fresh if you want to wipe the database and start over
# php artisan migrate:fresh --seed --force
php artisan migrate --seed --force

# Execute the CMD
echo "Starting application..."
exec "$@"
