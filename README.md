🏥 Infertility Treatment Management and Monitoring System

Phần mềm quản lý và theo dõi điều trị hiếm muộn

1. 📌 Giới thiệu dự án

Hệ thống được xây dựng nhằm quản lý và theo dõi toàn bộ quá trình điều trị hiếm muộn tại một cơ sở y tế.

Phần mềm hỗ trợ:

Quản lý dịch vụ điều trị hiếm muộn (IUI, IVF, …)

Quản lý bác sĩ và lịch làm việc

Theo dõi chi tiết tiến trình điều trị của bệnh nhân

Ghi nhận kết quả xét nghiệm và khám bệnh

Nhắc lịch tiêm thuốc, xét nghiệm, tái khám

Quản lý feedback, rating

Dashboard & báo cáo thống kê

Hệ thống được triển khai theo kiến trúc Microservices (BẮT BUỘC).

2. 👥 User Roles
Role	Mô tả
Guest	Người truy cập xem thông tin cơ sở y tế, dịch vụ
Customer	Bệnh nhân đăng ký dịch vụ điều trị
Doctor	Bác sĩ theo dõi và cập nhật tiến trình điều trị
Manager	Quản lý cơ sở y tế
Admin	Quản trị hệ thống
3. 🧱 Kiến trúc hệ thống
3.1 Kiến trúc tổng thể

Microservices Architecture

API Gateway

Service-to-Service Communication (REST / Message Broker)

Distributed System

3.2 Danh sách Microservices (Dự kiến)
Service	Mô tả	Thành viên phụ trách
Auth Service	Xác thực & phân quyền (JWT/OAuth2)	Member 1
User Service	Quản lý hồ sơ bệnh nhân	Member 2

Doctor Service	Quản lý bác sĩ & lịch làm việc	Member 3

Treatment Service	Quản lý quá trình điều trị IUI, IVF	Member 4

Appointment Service	Quản lý lịch hẹn & nhắc lịch	Member 5

Notification Service	Gửi thông báo (Firebase)	Member 6

Rating Service	Quản lý feedback & rating	Member 7
Service Catalog	Quản lý dịch vụ & bảng giá	Member 8
Reporting Service	Dashboard & báo cáo	Member 9

👉 Mỗi thành viên triển khai 01 Microservice độc lập

4. 🛠️ Công nghệ sử dụng
Backend

NodeJS / Java Spring Boot / .NET (tuỳ nhóm chọn)

RESTful API

JWT Authentication

Frontend

ReactJS / NextJS

Database

PostgreSQL / MySQL

Redis (Memory Cache)

Caching

Redis Cache

Memory Cache

Notification

Firebase Cloud Messaging (FCM)

Data Synchronization

Apache NiFi (đồng bộ dữ liệu giữa services)

Containerization & Deployment

Docker

Docker Compose

VPS / Cloud (AWS / GCP / Azure)

Project Management

Jira (Quản lý task, sprint, backlog)

5. 📦 Chức năng hệ thống
5.1 Trang chủ

Giới thiệu cơ sở y tế

Danh sách dịch vụ điều trị

Blog chia sẻ kiến thức

5.2 Đăng ký dịch vụ điều trị

Khách hàng có thể:

Đăng ký IUI (Thụ tinh trong tử cung)

Đăng ký IVF (Thụ tinh trong ống nghiệm)

Chọn bác sĩ điều trị

Xem bảng giá

5.3 Quản lý quá trình điều trị

Theo từng phương pháp:

IUI

Lịch tiêm thuốc

Ngày thực hiện thụ tinh

Theo dõi kết quả

IVF

Kích trứng

Chọc hút trứng

Thụ tinh trong ống nghiệm

Cấy phôi

Theo dõi thai

Bác sĩ có thể:

Ghi nhận kết quả xét nghiệm

Ghi chú tiến triển điều trị

Cập nhật tình trạng bệnh nhân

5.4 Nhắc lịch & thông báo

Nhắc lịch tiêm thuốc

Nhắc lịch xét nghiệm

Nhắc lịch tái khám

Thông báo qua Firebase

5.5 Quản lý bác sĩ

Thông tin cá nhân

Bằng cấp

Chuyên môn

Lịch làm việc

5.6 Quản lý rating & feedback

Customer đánh giá bác sĩ

Manager theo dõi chất lượng dịch vụ

5.7 Dashboard & Reporting

Thống kê số lượng bệnh nhân

Tỷ lệ thành công điều trị

Doanh thu theo dịch vụ

Báo cáo theo tháng / quý / năm

6. 🔐 Bảo mật

JWT Authentication

Role-based Authorization (RBAC)

HTTPS

Logging & Monitoring

7. 🔄 Đồng bộ dữ liệu

Sử dụng Apache NiFi

Đồng bộ dữ liệu giữa các Microservices

Hỗ trợ ETL và Data Flow Management

8. 🚀 Triển khai hệ thống
8.1 Local Development
docker-compose up --build

8.2 Production

Deploy từng service bằng Docker

Deploy trên:

VPS

AWS EC2

GCP

Azure

9. 📊 Quản lý dự án

Quản lý công việc bằng Jira

Daily Meeting

Thống nhất dữ liệu Confluence 

Sprint Review

10. 📁 Cấu trúc Repository (Gợi ý)
```   
infertility-system/
│
├── auth-service/
├── user-service/
├── doctor-service/
├── treatment-service/
├── appointment-service/
├── notification-service/
├── rating-service/
├── reporting-service/
├── api-gateway/
├── docker-compose.yml
└── README.md
```
11. 📌 Yêu cầu bắt buộc
```
✅ Kiến trúc Microservices
✅ Docker hóa toàn bộ hệ thống
✅ Sử dụng Redis cache
✅ Tích hợp Firebase Notification
✅ Đồng bộ dữ liệu bằng Apache NiFi
✅ Quản lý dự án bằng Jira
✅ Mỗi thành viên đảm nhiệm 01 microservice
```
12. 📈 Hướng phát triển tương lai

Tích hợp AI tư vấn điều trị

Mobile App (Flutter)

Hệ thống phân tích dữ liệu nâng cao

Machine Learning dự đoán tỷ lệ thành công
