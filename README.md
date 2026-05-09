![PHP](https://img.shields.io/badge/PHP-8.x-777BB4)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D)
![Docker](https://img.shields.io/badge/Docker-24.x-2496ED)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000)
![License](https://img.shields.io/badge/License-MIT-yellow)

# 🏥 Infertility Treatment Management and Monitoring System

**Phần mềm quản lý và theo dõi điều trị hiếm muộn**

Hệ thống hỗ trợ các cơ sở y tế quản lý toàn bộ quy trình điều trị hiếm muộn (IUI, IVF), từ đăng ký dịch vụ, theo dõi phác đồ, nhắc lịch, đến báo cáo thống kê và đánh giá chất lượng.

## 🎯 Mục tiêu

- Quản lý dịch vụ điều trị hiếm muộn (IUI, IVF,…) và bảng giá.
- Quản lý bác sĩ, lịch làm việc, chuyên môn.
- Theo dõi chi tiết tiến trình điều trị cho từng bệnh nhân.
- Ghi nhận kết quả xét nghiệm, khám bệnh, thụ thai.
- Tự động nhắc lịch tiêm thuốc, xét nghiệm, tái khám qua Firebase.
- Thu thập đánh giá (rating/feedback) từ bệnh nhân.
- Cung cấp dashboard & báo cáo thống kê cho quản lý.

## 🧱 Kiến trúc hệ thống

Hệ thống được xây dựng theo mô hình **Microservices Architecture**, giao tiếp qua API Gateway, REST, và Message Broker (RabbitMQ). Toàn bộ service được Docker hóa, sử dụng Redis cache và Apache NiFi để đồng bộ dữ liệu.

```
infertility-system/
├── auth-service/           # Xác thực, phân quyền (JWT)
├── catalog-service/        # Quản lý dịch vụ, bác sĩ, bảng giá
├── appointment-service/    # Đăng ký điều trị, đặt lịch khám
├── treatment-service/      # Phác đồ, xét nghiệm, kết quả
├── notification-service/   # Gửi thông báo (Firebase + RabbitMQ)
├── report-service/         # Dashboard, thống kê, đồng bộ NiFi
└──api-gateway/             # API Gateway
```

## 🗺️ Service Mapping

| Service                  | Chức năng chính                                                                                                                                           | Actor liên quan                         | Tính năng đã implement                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| **Auth Service**         | - Đăng nhập/đăng xuất<br>- Phân quyền RBAC (Admin, Manager, Doctor, Customer, Guest)<br>- Quản lý tài khoản, JWT                                          | Guest, Customer, Doctor, Manager, Admin | ✅ JWT authentication<br>✅ Role-based authorization                  |
| **Catalog Service**      | - CRUD dịch vụ (IUI/IVF)<br>- Quản lý thông tin bác sĩ (chuyên môn, bằng cấp)<br>- Bảng giá dịch vụ<br>- View profile bác sĩ                              | Customer, Doctor, Manager, Admin        | ✅ Service CRUD<br>✅ Doctor profiles<br>✅ Pricing management        |
| **Appointment Service**  | - Đăng ký gói điều trị mới<br>- Đặt lịch khám, chọn bác sĩ<br>- Xem lịch trình điều trị                                                                   | Customer, Doctor, Admin                 | ✅ Treatment registration<br>✅ Schedule management                   |
| **Treatment Service**    | - Quản lý phác đồ theo phương pháp (IUI/IVF)<br>- Lịch tiêm thuốc, xét nghiệm<br>- Ghi nhận kết quả xét nghiệm/thụ thai<br>- Cập nhật tiến triển điều trị | Doctor                                  | ✅ Protocol management<br>✅ Lab results entry<br>✅ Treatment events |
| **Notification Service** | - Nhắc lịch tiêm, xét nghiệm, tái khám<br>- Gửi thông báo qua Firebase<br>- Nhận sự kiện từ RabbitMQ                                                      | Customer, Doctor                        | ✅ Reminder system<br>✅ Firebase + RabbitMQ                          |
| **Report Service**       | - Dashboard & báo cáo thống kê<br>- Thống kê số ca, tỷ lệ thành công, doanh thu<br>- Đồng bộ dữ liệu qua Apache NiFi                                      | Manager, Admin                          | ✅ Analytics dashboard<br>✅ NiFi integration                         |

## 👥 User Roles

| Role         | Mô tả                                                             |
| ------------ | ----------------------------------------------------------------- |
| **Guest**    | Người truy cập xem thông tin cơ sở y tế, dịch vụ, blog            |
| **Customer** | Bệnh nhân đăng ký dịch vụ điều trị, theo dõi tiến trình, đánh giá |
| **Doctor**   | Bác sĩ theo dõi và cập nhật tiến trình điều trị, ghi nhận kết quả |
| **Manager**  | Quản lý cơ sở y tế, xem báo cáo, giám sát chất lượng              |
| **Admin**    | Quản trị hệ thống, quản lý tài khoản, phân quyền                  |

## 🛠️ Công nghệ sử dụng

### ⚙️ Backend

- **Ngôn ngữ**: PHP (RESTful API)
- **Xác thực**: JWT
- **Giao tiếp**: REST, RabbitMQ (event bus)
- **Cache**: Redis

### 💻 Frontend

- ReactJS + TailwindCSS + Vite
- Giao tiếp: HTTPS qua API Gateway

### 🗄️ Database & Integration

- **Database**: MySQL
- **Cache & session**: Redis
- **Message queue**: RabbitMQ
- **Push notification**: Firebase Cloud Messaging (FCM)
- **Data flow & ETL**: Apache NiFi

### 🐳 Deployment

- Docker (mỗi service là một container)
- Docker Compose

### 📋 Project Management

- Jira (quản lý task, sprint, backlog)
- Confluence (tài liệu)

## 🧱 Cấu trúc cơ sở dữ liệu

Mỗi microservice có database riêng để đảm bảo độc lập và bảo mật.

| Service              | Database                | Mục đích                     |
| -------------------- | ----------------------- | ---------------------------- |
| Auth Service         | auth_db (MySQL)         | Người dùng, role, phân quyền |
| Catalog Service      | catalog_db (MySQL)      | Dịch vụ, bác sĩ, bảng giá    |
| Appointment Service  | appointment_db (MySQL)  | Đăng ký điều trị, lịch khám  |
| Treatment Service    | treatment_db (MySQL)    | Phác đồ, xét nghiệm, kết quả |
| Notification Service | notification_db (MySQL) | Log thông báo, lịch nhắc     |
| Report Service       | report_db (MySQL)       | Dữ liệu tổng hợp, báo cáo    |

**Redis** được dùng để cache session và token.

## 🔄 Luồng dữ liệu (Data Flow)

1. **Guest/Customer đăng ký/đăng nhập** → Auth Service → JWT → Phân quyền
2. **Customer đăng ký dịch vụ** → Appointment Service → Tạo treatment plan
3. **Doctor cập nhật kết quả** → Treatment Service → Lưu xét nghiệm → Gửi event qua RabbitMQ
4. **Notification Service** → Nhận event → Gửi thông báo Firebase (nhắc lịch, kết quả)
5. **Manager/Admin xem báo cáo** → Report Service → Lấy dữ liệu từ NiFi (đồng bộ từ các service)
6. **Customer gửi rating/feedback** → Catalog Service → Lưu đánh giá bác sĩ

## 🚀 Triển khai hệ thống

Sử dụng Docker Compose để khởi chạy toàn bộ services.

### Khởi chạy local development

```bash
# Clone repository
git clone -b integration https://github.com/Dragon-Ky/Infertility-Treatment-Management-and-Monitoring-System.git
cd Infertility-Treatment-Management-and-Monitoring-System

# Tạo file .env (nếu cần, xem phần Environment Variables)

# Khởi chạy tất cả services
docker-compose up --build

# Xem logs
docker-compose logs -f

# Dừng hệ thống
docker-compose down
```

### Ports

| Service                  | Port  | URL                        |
| ------------------------ | ----- | -------------------------- |
| **API Gateway**          | 8080  | http://localhost:8080      |
| **Auth Service**         | 8001  | http://localhost:8001      |
| **Catalog Service**      | 8002  | http://localhost:8002      |
| **Appointment Service**  | 8003  | http://localhost:8003      |
| **Treatment Service**    | 8004  | http://localhost:8004      |
| **Notification Service** | 8005  | http://localhost:8005      |
| **Report Service**       | 8006  | http://localhost:8006      |
| **MySQL**                | 3306  | localhost:3306             |
| **Redis**                | 6379  | localhost:6379             |
| **RabbitMQ Management**  | 15672 | http://localhost:15672     |
| **NiFi**                 | 8080  | http://localhost:8080/nifi |

### Environment Variables

Tạo file `.env` hoặc cập nhật các biến môi trường trong `docker-compose.yml`:

```env
# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=auth_db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=YourSuperSecretKeyForJWT
JWT_EXPIRATION=86400

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_USER=guest
RABBITMQ_PASS=guest

# Firebase
FIREBASE_SERVER_KEY=your_firebase_server_key

# NiFi
NIFI_WEB_HTTP_PORT=8080
```

## 🎯 Tính năng đã hoàn thành

### Authentication & Authorization

- ✅ Đăng ký, đăng nhập với JWT
- ✅ Phân quyền theo role (Guest, Customer, Doctor, Manager, Admin)
- ✅ Quản lý tài khoản

### Catalog Management

- ✅ Hiển thị dịch vụ điều trị (IUI, IVF, ...)
- ✅ Quản lý bác sĩ (thông tin, bằng cấp, chuyên môn)
- ✅ Quản lý bảng giá
- ✅ Hiển thị thông tin profile bác sĩ

### Appointment & Treatment Registration

- ✅ Đăng ký gói điều trị (IUI, IVF, ...)
- ✅ Đặt lịch khám, chọn bác sĩ
- ✅ Xem lịch trình điều trị

### Treatment Tracking

- ✅ Quản lý phác đồ theo phương pháp
- ✅ Hiển thị lịch tiêm thuốc, xét nghiệm
- ✅ Ghi nhận kết quả xét nghiệm, thụ thia
- ✅ Cập nhật tiến triển điều trị

### Notification

- ✅ Nhắc lịch tiêm, xét nghiệm, tái khám
- ✅ Gửi thông báo đến người dùng
- ✅ Nhận sự kiện từ RabbitMQ

### Rating & Feedback

- ✅ Người dùng đánh giá dịch vụ, bác sĩ
- ✅ Quản lý theo dõi thống kê thông tin, chất lượng dịch vụ

### Dashboard & Reporting

- ✅ Thống kê số bệnh nhân, tỷ lệ thành công
- ✅ Doanh thu theo dịch vụ (tháng/quý/năm)
- ✅ Đồng bộ dữ liệu qua Apache NiFi

## 🚧 Tính năng đang phát triển

- 🚧 Tích hợp AI tư vấn phác đồ điều trị
- 🚧 Mobile app (Flutter)
- 🚧 Hệ thống phân tích dữ liệu nâng cao
- 🚧 Machine Learning dự đoán tỷ lệ thành công

## 📝 License

Dự án được phân phối dưới giấy phép MIT.

## 👥 Contributors

- Luu Gia Ky
- Le Nguyen Bao Khoa
- Bui Trieu Tin
- Nguyen Minh Thai
- Nguyen Truong Giang
- Vu Nguyen Tuan Khai

## 📞 Contact

Với câu hỏi hoặc hỗ trợ, vui lòng liên hệ với team hỗ trợ phát triển.
