# Report Service

## Overview

The Report Service is a microservice responsible for generating dashboards, reports, and statistics for the Infertility Treatment Management System. It aggregates data from other services and provides comprehensive analytics.

## Features

- **Dashboard Management**: Create and manage customizable dashboards
- **Report Generation**: Generate various types of reports (treatment success, revenue, patient, doctor, monthly, yearly)
- **Statistics Aggregation**: Collect and aggregate statistics from other services
- **Data Caching**: Redis-based caching for improved performance
- **Apache NiFi Integration**: Data synchronization from multiple services
- **RESTful API**: Clean and well-documented API endpoints

## Technology Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **Data Sync**: Apache NiFi

## Database Schema

### Tables

1. **dashboards**: Dashboard configurations
2. **reports**: Generated reports
3. **report_cache**: Cached report data
4. **sync_logs**: Data synchronization logs
5. **revenue_stats**: Revenue statistics
6. **treatment_stats**: Treatment statistics

## API Endpoints

### Public Endpoints

- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/overview` - Get system overview

### Protected Endpoints (JWT Required)

- `GET /api/reports/treatment-success` - Treatment success statistics
- `GET /api/reports/revenue` - Revenue statistics
- `GET /api/reports/patients` - Patient statistics
- `GET /api/reports/doctors` - Doctor performance
- `GET /api/reports/monthly/{month}` - Monthly report
- `GET /api/reports/yearly/{year}` - Yearly report
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/{id}/download` - Download report

### Admin Endpoints (Admin/Manager Role Required)

- `GET /api/admin/sync-status` - Data sync status
- `POST /api/admin/sync/trigger` - Trigger data sync

## Installation

### Prerequisites

- Docker & Docker Compose
- PHP 8.2+
- Composer
- MySQL 8.0
- Redis 7

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd wktr-report-service
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
composer install
```

4. Generate application key:

```bash
php artisan key:generate
```

5. Start Docker containers:

```bash
docker-compose up -d
```

6. Run migrations:

```bash
php artisan migrate
```

7. Access the service at `http://localhost:8006`

## Configuration

### Environment Variables

- `APP_NAME`: Application name
- `APP_ENV`: Application environment (local, production)
- `DB_*`: Database configuration
- `REDIS_*`: Redis configuration
- `AUTH_SERVICE_URL`: Auth service URL
- `CATALOG_SERVICE_URL`: Catalog service URL
- `APPOINTMENT_SERVICE_URL`: Appointment service URL
- `TREATMENT_SERVICE_URL`: Treatment service URL
- `NOTIFICATION_SERVICE_URL`: Notification service URL
- `NIFI_*`: Apache NiFi configuration
- `*_CACHE_TTL`: Cache TTL settings

## Services

### DashboardService

Manages dashboard data and system overview.

### ReportService

Handles report generation and management.

### StatisticsService

Aggregates statistics from various sources.

### CacheService

Manages Redis caching with database fallback.

### NiFiService

Handles data synchronization via Apache NiFi.

## Docker Configuration

The service includes:

- **report-service**: Laravel application container
- **mysql-report**: MySQL database
- **redis**: Redis cache server
- **nginx**: Web server with reverse proxy

## Development

### Running Tests

```bash
php artisan test
```

### Code Style

```bash
./vendor/bin/pint
```

## Deployment

1. Build Docker images:

```bash
docker-compose build
```

2. Start services:

```bash
docker-compose up -d
```

3. Run migrations:

```bash
docker-compose exec report-service php artisan migrate
```

## Monitoring

- Health check endpoint: `GET /up`
- Logs: `storage/logs/laravel.log`
- Sync logs: Available via `/api/admin/sync-status`

## Support

For issues and questions, please contact the development team or create an issue in the repository.
