# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "9876543210",
  "role": "customer",
  "shopName": "My Shop" // Only for shopkeeper role
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "63f7a8c1d1e4f5g6h7i8j9k0l",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "shopName": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "63f7a8c1d1e4f5g6h7i8j9k0l",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "63f7a8c1d1e4f5g6h7i8j9k0l",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "customer",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "createdAt": "2024-02-26T10:30:00Z",
  "updatedAt": "2024-02-26T10:30:00Z"
}
```

---

### Update Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "shopDescription": "Quality products at best prices" // For shopkeepers
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products`

**Query Parameters:**
- `category` (string) - Filter by category
- `search` (string) - Search by name or description
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `sort` (string) - `price-asc`, `price-desc`, `rating`

**Example:**
```
GET /products?category=Electronics&minPrice=100&maxPrice=5000&sort=price-asc
```

**Response (200):**
```json
{
  "count": 12,
  "products": [
    {
      "_id": "product123",
      "name": "Wireless Headphones",
      "description": "High quality bluetooth headphones",
      "category": "Electronics",
      "price": 2999,
      "originalPrice": 3999,
      "quantity": 25,
      "images": ["url1", "url2"],
      "isListed": true,
      "rating": 4.5,
      "shopkeeperId": {
        "_id": "shop123",
        "shopName": "TechStore"
      },
      "createdAt": "2024-02-26T10:30:00Z"
    }
  ]
}
```

**Notes:**
- Only products with `isListed: true` and `quantity > 10` are returned
- Customers cannot see unlisted products

---

### Get Product Details
**GET** `/products/:id`

**Response (200):**
```json
{
  "_id": "product123",
  "name": "Wireless Headphones",
  "description": "High quality bluetooth headphones",
  "category": "Electronics",
  "price": 2999,
  "originalPrice": 3999,
  "quantity": 25,
  "images": ["url1", "url2"],
  "isListed": true,
  "rating": 4.5,
  "reviews": [
    {
      "userId": "user123",
      "rating": 5,
      "comment": "Great product!",
      "createdAt": "2024-02-26T10:30:00Z"
    }
  ],
  "shopkeeperId": {
    "_id": "shop123",
    "shopName": "TechStore",
    "shopDescription": "Best tech products",
    "address": {}
  }
}
```

---

### Create Product (Shopkeeper Only)
**POST** `/products`

**Headers:**
```
Authorization: Bearer <shopkeeper_token>
```

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "description": "High quality bluetooth headphones with noise cancellation",
  "category": "Electronics",
  "price": 2999,
  "originalPrice": 3999,
  "quantity": 50,
  "images": ["https://image-url-1.jpg", "https://image-url-2.jpg"],
  "sku": "HEADPHONES-WL-001",
  "tags": ["electronics", "audio", "wireless"]
}
```

**Response (201):**
```json
{
  "message": "Product created successfully",
  "product": { ... }
}
```

---

### Update Product (Shopkeeper Only)
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer <shopkeeper_token>
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "quantity": 45,
  "price": 2899
}
```

**Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": { ... }
}
```

**Auto-Listing Logic:**
- If `quantity <= 10` → `isListed` becomes `false`
- If `quantity > 10` → `isListed` becomes `true`

---

### Delete Product (Shopkeeper Only)
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <shopkeeper_token>
```

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

### Get Shopkeeper Products
**GET** `/products/shopkeeper/products/all`

**Headers:**
```
Authorization: Bearer <shopkeeper_token>
```

**Response (200):**
```json
{
  "count": 12,
  "products": [ ... ]
}
```

**Note:** Returns all products (listed and unlisted) for the shopkeeper

---

### Get Categories
**GET** `/products/categories`

**Response (200):**
```json
{
  "categories": [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Sports"
  ]
}
```

---

## Cart Endpoints

### Get Cart
**GET** `/cart`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response (200):**
```json
{
  "_id": "cart123",
  "customerId": "user123",
  "items": [
    {
      "_id": "item1",
      "productId": {
        "_id": "product123",
        "name": "Wireless Headphones",
        "description": "...",
        "images": ["url"]
      },
      "quantity": 2,
      "price": 2999
    }
  ],
  "totalAmount": 5998,
  "createdAt": "2024-02-26T10:30:00Z"
}
```

---

### Add to Cart
**POST** `/cart/add`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Request Body:**
```json
{
  "productId": "product123",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "message": "Item added to cart",
  "cart": { ... }
}
```

**Validation:**
- `quantity` must be ≤ available `product.quantity`
- Product must be `isListed: true`

---

### Remove from Cart
**POST** `/cart/remove`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Request Body:**
```json
{
  "productId": "product123"
}
```

**Response (200):**
```json
{
  "message": "Item removed from cart",
  "cart": { ... }
}
```

---

### Update Cart Quantity
**POST** `/cart/update-quantity`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Request Body:**
```json
{
  "productId": "product123",
  "quantity": 5
}
```

**Response (200):**
```json
{
  "message": "Cart updated",
  "cart": { ... }
}
```

---

### Clear Cart
**DELETE** `/cart/clear`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response (200):**
```json
{
  "message": "Cart cleared",
  "items": [],
  "totalAmount": 0
}
```

---

## Order Endpoints

### Create Order
**POST** `/orders`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product123",
      "quantity": 2
    },
    {
      "productId": "product456",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "order123",
    "orderNumber": "ORD-1708927800000-abc12345",
    "customerId": "user123",
    "shopkeeperId": "shop123",
    "items": [ ... ],
    "totalAmount": 5998,
    "orderStatus": "pending",
    "paymentStatus": "pending",
    "paymentMethod": "card",
    "shippingAddress": { ... },
    "createdAt": "2024-02-26T10:30:00Z"
  }
}
```

**Side Effects:**
- Products inventory is decremented
- Cart is cleared

---

### Get Order Details
**GET** `/orders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "order123",
  "orderNumber": "ORD-1708927800000-abc12345",
  "customerId": "user123",
  "shopkeeperId": "shop123",
  "items": [
    {
      "productId": { ... },
      "name": "Wireless Headphones",
      "price": 2999,
      "quantity": 2,
      "totalPrice": 5998
    }
  ],
  "totalAmount": 5998,
  "tax": 0,
  "discount": 0,
  "orderStatus": "confirmed",
  "paymentStatus": "completed",
  "paymentMethod": "card",
  "shippingAddress": { ... },
  "trackingNumber": "TRK123456789",
  "createdAt": "2024-02-26T10:30:00Z"
}
```

---

### Get Customer Orders
**GET** `/orders`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response (200):**
```json
{
  "count": 5,
  "orders": [
    {
      "_id": "order123",
      "orderNumber": "ORD-...",
      "totalAmount": 5998,
      "orderStatus": "delivered",
      "paymentStatus": "completed",
      "createdAt": "2024-02-26T10:30:00Z"
    }
  ]
}
```

---

### Get Shopkeeper Orders
**GET** `/orders/shopkeeper/all/orders`

**Headers:**
```
Authorization: Bearer <shopkeeper_token>
```

**Response (200):**
```json
{
  "count": 25,
  "orders": [
    {
      "_id": "order123",
      "orderNumber": "ORD-...",
      "customerId": { ... },
      "items": [ ... ],
      "totalAmount": 5998,
      "orderStatus": "pending",
      "createdAt": "2024-02-26T10:30:00Z"
    }
  ]
}
```

---

### Update Order Status (Shopkeeper Only)
**PUT** `/orders/:id/status`

**Headers:**
```
Authorization: Bearer <shopkeeper_token>
```

**Request Body:**
```json
{
  "orderStatus": "shipped"
}
```

**Valid Statuses:**
- `pending` → `confirmed` → `processing` → `shipped` → `delivered`
- Any status → `cancelled`

**Response (200):**
```json
{
  "message": "Order status updated",
  "order": { ... }
}
```

---

### Cancel Order (Customer Only)
**POST** `/orders/:id/cancel`

**Headers:**
```
Authorization: Bearer <customer_token>
```

**Response (200):**
```json
{
  "message": "Order cancelled successfully",
  "order": { ... }
}
```

**Conditions:**
- Can only cancel if status is: `pending`, `confirmed`, or `processing`
- Cannot cancel: `shipped`, `delivered`, or `cancelled`
- Product inventory is restored on cancellation

---

## Shopkeeper Endpoints

### Get Dashboard Stats
**GET** `/shopkeeper/dashboard/stats`

**Headers:**
```
Authorization: Bearer <shopkeeper_token>
```

**Response (200):**
```json
{
  "totalProducts": 45,
  "listedProducts": 38,
  "unlistedProducts": 7,
  "totalQuantity": 1250,
  "totalValue": 850000
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Required fields missing"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 409 Conflict
```json
{
  "message": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Something went wrong",
  "error": "Error message"
}
```

---

## Rate Limiting

- Unauthenticated requests: 100 requests per 15 minutes
- All requests: 500 requests per hour

**When Limited:**
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Something went wrong |

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "test123",
    "phone": "9876543210",
    "role": "customer"
  }'
```

### Get Products
```bash
curl -X GET "http://localhost:5000/api/products?category=Electronics&sort=price-asc"
```

### Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

---

## Postman Collection

Import this JSON into Postman for easier testing:

```json
{
  "info": {
    "name": "EcommercePro API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login"
          }
        }
      ]
    }
  ]
}
```

---

**API Documentation Complete - Ready for Integration!** 🚀
