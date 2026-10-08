# White Mist Dishwashers - Comprehensive REST API Specification

**Base API URL**: `http://localhost:5000/api/v1`  
**Swagger UI Docs**: `http://localhost:5000/api/v1/docs`  
**Authentication Header**: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. System Health Endpoint

### `GET /health`
Verify server status, uptime, node version, and active MySQL connection pool health.
- **Auth**: None
- **Response 200 OK**:
```json
{
  "status": "OK",
  "timestamp": "2026-10-07T12:00:00.000Z",
  "uptime": 142.5,
  "service": "White Mist Dishwashers REST API",
  "environment": "development",
  "database": {
    "connected": true,
    "driver": "MySQL 8.x",
    "status": "Healthy"
  }
}
```

---

## 2. Authentication & Account Management (`/api/v1/auth`)

### `POST /api/v1/auth/register`
Register a new customer account.
- **Auth**: None
- **Body**:
```json
{
  "email": "customer@example.com",
  "password": "Password123!",
  "full_name": "Rahul Verma",
  "phone": "+91 9988776655"
}
```
- **Response 201 Created**:
```json
{
  "success": true,
  "message": "Account registered successfully",
  "data": {
    "user": {
      "id": 5,
      "email": "customer@example.com",
      "full_name": "Rahul Verma",
      "role_name": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
}
```

### `POST /api/v1/auth/login`
Authenticate existing customer or staff member.
- **Auth**: None
- **Body**:
```json
{
  "email": "customer@example.com",
  "password": "Password123!"
}
```
- **Response 200 OK**: Returns user object and JWT access + refresh tokens.

---

## 3. Product Catalogue & Search (`/api/v1/products`)

### `GET /api/v1/products`
Retrieve dishwasher products with multi-attribute filtering, search, sorting, and pagination.
- **Query Parameters**:
  - `search`: Keyword for name, model number, or SKU
  - `category`: `freestanding`, `built-in`, `compact`, `premium`, `commercial`, `care-accessories`
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter
  - `capacity`: Minimum place settings capacity (e.g. `14`)
  - `energyRating`: Energy efficiency filter (`5 Star`)
  - `noiseLevel`: Maximum acceptable noise level in dB (e.g. `44`)
  - `sortBy`: `price`, `rating`, `capacity`, `created_at`
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `12`)

- **Response 200 OK**:
```json
{
  "success": true,
  "message": "Dishwasher products retrieved successfully",
  "data": [
    {
      "id": 1,
      "sku": "WM-DW-14F",
      "model_number": "WM-FC1400",
      "name": "White Mist MasterClean 14-Place Freestanding Dishwasher",
      "slug": "wm-masterclean-14-freestanding",
      "price": 42999.00,
      "discount_price": 38999.00,
      "badge": "Bestseller",
      "capacity": 14,
      "energy_rating": "5 Star A+++",
      "water_consumption": 9.5,
      "noise_level": 44,
      "category_name": "Freestanding Dishwashers",
      "images": ["/assets/images/dishwasher_freestanding.png"],
      "specs": [
        { "spec_key": "Place Settings", "spec_value": "14 Place Settings" }
      ],
      "features": [
        "70°C Hot Hygiene Wash against 99.99% Germs"
      ]
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 12,
    "totalPages": 1
  }
}
```

### `GET /api/v1/products/:idOrSlug`
Get complete details of a specific dishwasher model by product ID or slug.

---

## 4. Enquiry & Quote Requests (`/api/v1/enquiries` & `/api/v1/quotes`)

### `POST /api/v1/enquiries`
Submit a dishwasher product inquiry.
- **Body**:
```json
{
  "name": "Vikramaditya Roy",
  "email": "vikram.roy@example.com",
  "phone": "+91 9876501234",
  "location": "Bangalore, Karnataka",
  "product_id": 1,
  "model_number": "WM-FC1400",
  "message": "Interested in buying 2 units for home and villa.",
  "preferred_contact_method": "PHONE"
}
```

### `POST /api/v1/quotes`
Request a customized bulk commercial quote.
- **Body**:
```json
{
  "customer_name": "Oberoi Grand Cafe",
  "customer_email": "procurement@oberoicafe.com",
  "customer_phone": "+91 9876112233",
  "location": "Mumbai, Maharashtra",
  "product_id": 4,
  "quantity": 3,
  "message": "Need commercial quote for 3 units with 3 years AMC."
}
```

---

## 5. Service & Installation Management (`/api/v1/services`)

### `POST /api/v1/services`
Book installation, maintenance, repair, or warranty service ticket.
- **Body**:
```json
{
  "customer_name": "Rahul Verma",
  "customer_email": "customer@example.com",
  "customer_phone": "+91 9988776655",
  "service_type": "INSTALLATION",
  "problem_description": "New purchase installation required",
  "address_line": "102 MG Road, Indiranagar",
  "city": "Bangalore",
  "state": "Karnataka",
  "postal_code": "560038",
  "preferred_date": "2026-10-10"
}
```
- **Response 201 Created**: Returns ticket number (`SRV-2026-XXXX`).

---

## 6. Warranty Management & Claims (`/api/v1/warranties`)

### `GET /api/v1/warranties/verify/:serialNumber`
Verify dishwasher warranty status and claims history by serial number.
- **Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "warranty": {
      "warranty_code": "WRN-WM-2026-8810",
      "model_number": "WM-FC1400",
      "serial_number": "WM-DW-2026-9948",
      "warranty_start_date": "2026-01-15",
      "warranty_end_date": "2028-01-15",
      "is_valid": true,
      "claims": []
    }
  }
}
```

### `POST /api/v1/warranties/claim/:serialNumber`
File a new warranty repair/replacement claim against an active warranty.

---

## 7. Orders & Cart Checkout (`/api/v1/orders`)

### `POST /api/v1/orders/checkout`
Submit shopping cart for order processing and inventory reservation.
- **Body**:
```json
{
  "customer_name": "Rahul Verma",
  "customer_email": "customer@example.com",
  "customer_phone": "+91 9988776655",
  "items": [
    { "product_id": 1, "quantity": 1 }
  ],
  "shipping_address": {
    "address_line1": "102 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "postal_code": "560038"
  },
  "payment_method": "CREDIT_CARD"
}
```

---

## 8. Admin Dashboard & Management (`/api/v1/admin`)

### `GET /api/v1/admin/dashboard`
Retrieve high-level business metrics, sales revenue, enquiry counts, pending service requests, and low-stock alerts.
- **Auth Required**: `Bearer <ADMIN_JWT_TOKEN>`
