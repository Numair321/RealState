# InvestorsDeaal Backend - Spring Boot

Complete REST API backend for the Real Estate MLM Platform.

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Additional**: Lombok, ModelMapper, Commons

## Project Structure

```
backend/
├── src/main/java/com/investorsdeaal/
│   ├── RealEstateMLMApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   └── ModelMapperConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── PropertyController.java
│   │   ├── LeadController.java
│   │   ├── CommissionController.java
│   │   └── AdminController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── PropertyService.java
│   │   ├── LeadService.java
│   │   ├── CommissionService.java
│   │   ├── MLMService.java
│   │   └── FileStorageService.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── PropertyRepository.java
│   │   ├── LeadRepository.java
│   │   └── CommissionRepository.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Property.java
│   │   ├── Lead.java
│   │   └── Commission.java
│   ├── dto/
│   │   ├── AuthRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AuthResponse.java
│   │   ├── UserDTO.java
│   │   ├── PropertyDTO.java
│   │   └── LeadDTO.java
│   ├── security/
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   ├── ResourceNotFoundException.java
│   │   └── BadRequestException.java
│   └── util/
│       ├── ReferralCodeGenerator.java
│       └── ResponseUtil.java
└── src/main/resources/
    ├── application.properties
    └── application-dev.properties
```

## Database Schema

### Tables:
1. **users** - User accounts (Admin, Associate, Company, Buyer, Seller)
2. **properties** - Property listings
3. **leads** - Lead management
4. **commissions** - Commission tracking
5. **property_images** - Property images
6. **property_amenities** - Property amenities

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password
- `PUT /api/users/settings` - Update settings

### Property Management
- `GET /api/properties` - List all properties (with filters)
- `GET /api/properties/{id}` - Get property details
- `POST /api/properties` - Create property (Associate)
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property
- `POST /api/properties/{id}/images` - Upload images

### Lead Management
- `GET /api/leads` - List leads
- `GET /api/leads/{id}` - Get lead details
- `POST /api/leads` - Create lead
- `PUT /api/leads/{id}` - Update lead
- `PUT /api/leads/{id}/status` - Update lead status
- `POST /api/leads/{id}/followup` - Schedule followup

### Commission Management
- `GET /api/commissions` - List commissions
- `GET /api/commissions/earnings` - Get earnings summary
- `GET /api/commissions/transactions` - Transaction history
- `POST /api/commissions/calculate` - Calculate commission

### MLM/Network
- `GET /api/mlm/network` - Get network tree
- `GET /api/mlm/referrals` - Get direct referrals
- `GET /api/mlm/stats` - Network statistics
- `GET /api/mlm/referral-link` - Get referral link

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}/status` - Approve/reject user
- `GET /api/admin/properties/pending` - Pending properties
- `PUT /api/admin/properties/{id}/approve` - Approve property
- `GET /api/admin/dashboard` - Admin dashboard stats
- `PUT /api/admin/commission-config` - Update commission rates

## Setup Instructions

### 1. Database Setup

```sql
CREATE DATABASE investorsdeaal_db;
USE investorsdeaal_db;
```

### 2. Configure Application

Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/investorsdeaal_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build & Run

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Or run JAR
java -jar target/real-estate-mlm-1.0.0.jar
```

Server will start on: `http://localhost:5000`

## Features Implemented

### ✅ Core Features
- JWT Authentication & Authorization
- Role-based Access Control (RBAC)
- User Registration & Login
- Profile Management
- Password Change

### ✅ Property Management
- CRUD operations
- Image upload
- Search & Filter
- Status management (Pending/Approved/Rejected)
- Featured & Hot Deals

### ✅ Lead Management
- Lead assignment (geo-based)
- Status tracking
- Follow-up scheduling
- Escalation system
- Lead analytics

### ✅ MLM System
- Referral tracking
- Multi-level commission (5 levels)
- Network tree
- Commission calculation
- Referral code generation

### ✅ Commission Management
- Transaction-based commission
- Multi-level distribution
- Referral bonuses
- Payment tracking
- Earnings reports

### ✅ Admin Features
- User approval/rejection
- Property approval
- Commission configuration
- System analytics
- Lead oversight

## Security

- JWT token-based authentication
- Password encryption (BCrypt)
- Role-based authorization
- CORS configuration
- Input validation
- SQL injection prevention

## Testing

```bash
# Run tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## Deployment

### Production Configuration

Create `application-prod.properties`:
```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
```

### Docker Deployment

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## API Documentation

Swagger UI available at: `http://localhost:5000/swagger-ui.html`

## Environment Variables

```
DB_URL=jdbc:mysql://localhost:3306/investorsdeaal_db
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=your-secret-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Support

For issues and questions, contact: support@investorsdeaal.com

## License

Proprietary - All rights reserved
