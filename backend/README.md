# White Mist Dishwashers - Production REST API & MySQL Database System

Comprehensive, commercial-grade backend service built for White Mist Residential & Commercial Dishwasher Appliance Company.

---

## 🌟 Key Features & Systems Implemented

1. **Dishwasher Product Management System**:
   - Freestanding, Built-in, Compact/Tabletop, Premium Smart, and Commercial Hood Dishwashers.
   - Specs: Place Settings capacity, Dimensions, Energy Rating (5 Star), Water Consumption (Liters/cycle), Noise Level (dB), Wash Programs.
   - Multi-image support, specifications table, key feature highlights, and stock tracking.
2. **Category Management**: Admin-managed dishwasher categories.
3. **Product Search & Multi-Attribute Filtering**: Search by SKU, model, price range, capacity, noise level, and energy rating.
4. **Customer Accounts & Security**: User registration, login, JWT access/refresh tokens, password hashing with bcrypt, role-based authorization (CUSTOMER, ADMIN, SALES_STAFF, SERVICE_STAFF, SUPER_ADMIN).
5. **Dishwasher Enquiry System**: Customer purchase inquiry submissions with admin assignment, status updates, and history tracking.
6. **Product Inquiry / "Request a Quote"**: Customized bulk and commercial dishwasher quote requests.
7. **Service & Installation System**: Ticket booking for installation, repair, maintenance, warranty service, technician assignment, and history.
8. **Warranty Management**: Serial number verification, warranty coverage check, and claims filing.
9. **Orders & Ecommerce**: Shopping cart checkout, pricing calculations, GST tax calculation, shipping rules, and database transaction safety.
10. **Inventory Tracking**: Stock quantity, low-stock detection alerts, and audit logs.
11. **General Contact System**: Contact form submissions with status management.
12. **Newsletter System**: Subscription and unsubscription management.
13. **Executive Admin Dashboard**: KPIs for total customers, products, sales revenue, new enquiries, pending service requests, and low-stock alerts.
14. **Database Audit Logs**: Detailed administrative activity trail.
15. **OpenAPI / Swagger Documentation**: Interactive API testing UI at `/api/v1/docs`.
16. **Health Check Endpoint**: `/health` verifying system uptime and MySQL connection pool status.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js v24+ (ES Modules)
- **Framework**: Express.js
- **Database**: MySQL 8.x (`mysql2` connection pooling + fallback in-memory mode)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Validation**: `express-validator`
- **Security**: `helmet`, `cors`, `express-rate-limit`
- **Logging**: `winston` + `morgan`
- **Documentation**: Swagger UI (`swagger-ui-express`)
- **Testing**: Jest + Supertest

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Database Migrations & Seeders
```bash
npm run db:setup
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at:
- **Base URL**: `http://localhost:5000/api/v1`
- **Health Check**: `http://localhost:5000/health`
- **Swagger Docs**: `http://localhost:5000/api/v1/docs`

---

## 🧪 Automated Testing
Run the automated Jest test suite covering Auth, Products, Enquiries, Service Requests, Warranty Claims, Orders, and Health checks:
```bash
npm test
```

---

## 🐳 Docker Deployment

To launch both MySQL 8.0 and the Backend REST API in containers:
```bash
docker-compose up --build -d
```
