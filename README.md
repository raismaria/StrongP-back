# 📦 StrongProjects Backend API

Modern RESTful API for ecommerce pump products management system.

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/fatimaBenazzou/book-management-back.git
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# See .env.example for required variables
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://mariarais1906_db_user:K22eCQ.n4JCH@cluster0.npzidbh.mongodb.net/?appName=Cluster0
AUTH_SECRET=your-super-secret-key-change-this-in-production-2025
NODE_ENV=development
```

### Running the Server

```bash
# Development mode with auto-reload (requires nodemon)
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Endpoints

### Register a New User

```
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { success: true, data: { user }, token: "jwt_token" }
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: { success: true, data: { user }, token: "jwt_token" }
```

### Get Current User (Protected)

```
GET /auth
Authorization: Bearer <token>

Response: { success: true, data: { user } }
```

---

## 🏭 Products Endpoints

### Get All Products

```
GET /products?category=Pompes solaires&q=search&limit=10&page=1

Query Parameters:
- category: "Pompes solaires" | "Pompes piscines" | "Pompes standards"
- q: Search query (searches in name and description)
- limit: Items per page (default: 10)
- page: Page number (default: 1)

Response:
{
  "success": true,
  "data": {
    "products": [...],
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

### Get Product by ID

```
GET /products/:id

Response: { success: true, data: { product } }
```

### Create Product (Admin Only)

```
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Solar Pump XL",
  "description": "High-efficiency solar pump for large installations",
  "price": 499.99,
  "category": "Pompes solaires",
  "images": ["url1", "url2"],
  "stock": 25
}

Response: { success: true, data: { product }, statusCode: 201 }
```

### Update Product (Admin Only)

```
PUT /products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 599.99,
  "stock": 30
  // Include only fields to update
}

Response: { success: true, data: { product } }
```

### Delete Product (Admin Only)

```
DELETE /products/:id
Authorization: Bearer <admin_token>

Response: { success: true, data: null }
```

---

## 🛒 Orders Endpoints

### Create Order (Protected)

```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "product_id",
      "qty": 2,
      "price": 299.99
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "paymentMethod": "card"
}

Response: { success: true, data: { order }, statusCode: 201 }
```

### Get My Orders (Protected)

```
GET /orders/my?page=1&limit=10
Authorization: Bearer <token>

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)

Response:
{
  "success": true,
  "data": {
    "orders": [...],
    "total": 5,
    "page": 1,
    "pages": 1
  }
}
```

### Get Order by ID (Protected)

```
GET /orders/:id
Authorization: Bearer <token>

Response: { success: true, data: { order } }
```

### Update Order Status (Protected)

```
PUT /orders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped" | "delivered" | "cancelled" | "confirmed"
}

Response: { success: true, data: { order } }
```

---

## 📊 Product Categories

All products must belong to one of these categories:

- **Pompes solaires** - Solar-powered pumps
- **Pompes piscines** - Swimming pool pumps
- **Pompes standards** - Standard industrial pumps

---

## 🔑 Order Status Workflow

```
pending → confirmed → shipped → delivered
   ↓
cancelled (anytime)
```

---

## ⚙️ Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Middleware**: CORS, Helmet, Morgan
- **Validation**: Zod
- **ORM**: Mongoose

---

## 📝 Sample Requests

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

### Get Products

```bash
curl "http://localhost:5000/api/products?category=Pompes%20solaires&limit=5"
```

### Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"product": "product_id", "qty": 1, "price": 299.99}],
    "shippingAddress": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    }
  }'
```

---

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **CORS Protection**: Configurable CORS origin
- **Helmet**: HTTP security headers
- **Input Validation**: Zod schemas
- **Error Handling**: Comprehensive error messages

---

## 📦 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── handlers/
│   ├── auth.js            # Auth logic
│   ├── products.js        # Product CRUD
│   └── orders.js          # Order management
├── middlewares/
│   ├── auth.js            # JWT verification
│   ├── errorHandler.js    # Error handling
│   └── validations.js     # Request validation
├── models/
│   ├── user.js            # User schema
│   ├── products.js        # Product schema
│   └── orders.js          # Order schema
├── routes/
│   ├── auth.js            # Auth routes
│   ├── products.js        # Product routes
│   └── orders.js          # Order routes
├── utils/
│   ├── errors.js          # Error definitions
│   └── responseFormatter.js # Response format
├── validation/
│   └── users.js           # User validation schemas
├── app.js                 # Express app setup
├── index.js               # Server entry point
├── .env                   # Environment variables
└── package.json           # Dependencies
```

---

## 🐛 Debugging

### Enable Debug Logs

```env
NODE_ENV=development
```

### Common Issues

**MongoDB Connection Error**

- Verify MONGO_URI is correct
- Check internet connection
- Ensure MongoDB Atlas cluster is active

**Auth Token Invalid**

- Token might be expired
- Check AUTH_SECRET matches
- Ensure Bearer token format: `Bearer <token>`

**CORS Error**

- Verify frontend URL in CORS config
- Default: http://localhost:5173

---

## 📄 License

ISC

---

## 👤 Author

Fatima Benazzou

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues and questions:

1. Check the [API Documentation](#-api-documentation)
2. Review error messages in server logs
3. Verify all environment variables are set correctly

---

**Built with ❤️ for StrongProjects**
