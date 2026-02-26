# EcommercePro - Production-Level E-Commerce Platform

A fully functional, production-ready e-commerce platform inspired by JioMart and Flipkart. This platform allows shopkeepers to manage inventory and customers to browse and purchase products.

## 🎯 Key Features

### Customer Features
- ✨ Browse products with filtering and search
- 🛍️ Add products to cart
- 💳 Secure checkout process
- 📦 Order tracking and management
- ⭐ Product reviews and ratings
- 📝 Order history

### Shopkeeper Features
- 📊 Dashboard with inventory analytics
- ➕ Add, edit, and delete products
- 📈 Automatic inventory management
- 🔴 **Auto-unlisting**: Products with quantity ≤ 10 are automatically hidden from customer view
- 📋 Order management
- 📊 Sales statistics

### Security & Performance
- 🔐 JWT-based authentication
- 🔒 Password hashing with bcryptjs
- ✅ Role-based access control
- 🚀 Optimized database queries
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB
- JWT Authentication
- Bcryptjs for password hashing

**Frontend:**
- React 18
- React Router v6
- Zustand (State Management)
- Axios (HTTP Client)
- Tailwind CSS
- React Icons
- React Hot Toast (Notifications)

**DevOps:**
- Docker & Docker Compose
- Nginx (Reverse Proxy)

## 📋 Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Setup Backend

```bash
cd ecommerce-platform/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
# JWT_SECRET=your_secure_jwt_secret

# Start backend
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Setup Frontend

```bash
cd ecommerce-platform/frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will open at `http://localhost:3000`

## 🐳 Docker Setup (Recommended for Production)

```bash
cd ecommerce-platform

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at `http://localhost:3000`

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register - Register new user
POST   /api/auth/login - Login user
GET    /api/auth/profile - Get user profile
PUT    /api/auth/profile - Update user profile
```

### Products
```
GET    /api/products - Get all listed products (with filters)
GET    /api/products/:id - Get product details
POST   /api/products - Create product (shopkeeper only)
PUT    /api/products/:id - Update product (shopkeeper only)
DELETE /api/products/:id - Delete product (shopkeeper only)
GET    /api/products/shopkeeper/products/all - Get shopkeeper's products
GET    /api/products/categories - Get all categories
```

### Cart
```
GET    /api/cart - Get cart
POST   /api/cart/add - Add item to cart
POST   /api/cart/remove - Remove item from cart
POST   /api/cart/update-quantity - Update quantity
DELETE /api/cart/clear - Clear cart
```

### Orders
```
POST   /api/orders - Create order
GET    /api/orders - Get customer orders
GET    /api/orders/:id - Get order details
PUT    /api/orders/:id/status - Update order status (shopkeeper)
POST   /api/orders/:id/cancel - Cancel order (customer)
GET    /api/orders/shopkeeper/all/orders - Get shopkeeper orders
```

### Shopkeeper
```
GET    /api/shopkeeper/dashboard/stats - Get dashboard statistics
```

## 🔑 Key Business Logic

### Inventory Management (Auto-listing)
- **Threshold**: Products with quantity ≤ 10 are automatically marked as unlisted
- Products automatically become listed when quantity exceeds 10
- Customers cannot see unlisted products
- Shopkeepers can still see and manage unlisted products

### Order Processing
1. Customer adds items to cart
2. Proceed to checkout
3. Enter shipping address
4. Select payment method
5. Place order (inventory decremented)
6. Order appears in both customer and shopkeeper dashboards
7. Shopkeeper can update order status
8. Customer can cancel pending orders (restores inventory)

## 👥 User Roles

### Customer
- Browse products
- Search and filter
- Manage cart
- Place orders
- Track orders
- Cancel orders

### Shopkeeper
- Add/edit/delete products
- Manage inventory
- View orders
- Update order status
- Dashboard analytics

### Admin (Future)
- System administration
- User management
- Analytics

## 📝 Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
JWT_SECRET=your_very_secure_secret_key_min_32_chars
PORT=5000
NODE_ENV=production
STRIPE_SECRET_KEY=your_stripe_key (optional)
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Security Features

- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens with 7-day expiration
- Role-based authorization
- Protected routes on frontend
- CORS enabled
- Input validation
- Secure MongoDB connection

## 📦 Database Schema

### User
- name, email, password (hashed), phone
- role (customer, shopkeeper, admin)
- shopName, shopDescription (for shopkeepers)
- address, profileImage
- isVerified, timestamps

### Product
- shopkeeperId (ref: User)
- name, description, category
- price, originalPrice, quantity
- images, sku, tags
- isListed (auto-managed based on quantity)
- rating, reviews
- timestamps

### Order
- customerId (ref: User)
- shopkeeperId (ref: User)
- items (array of products with quantities)
- orderNumber, totalAmount, discount, tax
- paymentMethod, paymentStatus, orderStatus
- shippingAddress, trackingNumber
- timestamps

### Cart
- customerId (ref: User)
- items (array with productId, quantity, price)
- totalAmount, timestamps

## 🧪 Testing

Test account credentials:
```
Customer:
Email: customer@test.com
Password: password123

Shopkeeper:
Email: shop@test.com
Password: password123
```

## 📊 Performance Optimization

- Database indexing on frequently queried fields
- Pagination support (can be added)
- Efficient product filtering
- Optimized API responses
- Lazy loading on frontend
- CSS minification with Tailwind

## 🚀 Deployment

### Using Docker (Recommended)
```bash
docker-compose -f docker-compose.yml up -d
```

### Manual Deployment
1. Set up Node.js and MongoDB on server
2. Clone repository
3. Install dependencies for both backend and frontend
4. Set up environment variables
5. Build frontend: `npm run build`
6. Run backend with process manager (PM2)
7. Serve frontend with Nginx/Apache

### Environment: Production
Update these before deploying:
- Change JWT_SECRET to a strong random string
- Use MongoDB Atlas (cloud) instead of local
- Enable HTTPS/SSL
- Set NODE_ENV=production
- Configure CORS origins properly
- Add rate limiting
- Set up logging

## 📚 Database Setup

1. **MongoDB Atlas (Recommended)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Copy connection string
   - Add to MONGODB_URI in .env

2. **Local MongoDB**
   ```bash
   # Install MongoDB Community Edition
   # Or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## 🔄 Workflow Example

1. **Shopkeeper registers** with shop name
2. **Adds products** with category, price, quantity
3. **Sets quantity to 15** - Product becomes LISTED in customer view
4. **Sells 6 units** - Quantity becomes 9 - Product becomes UNLISTED
5. **Adds 5 more units** - Quantity becomes 14 - Product becomes LISTED again
6. **Customers see** only products with quantity > 10

## 🤝 Contributing

To extend this project:
1. Add payment gateway integration (Stripe/Razorpay)
2. Implement email notifications
3. Add product recommendations
4. Advanced analytics
5. Multi-vendor support
6. Wallet system
7. Subscription management

## 📄 License

MIT License

## 🆘 Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Ensure all npm packages are installed
- Check if port 5000 is available

**Frontend won't load products:**
- Ensure backend is running
- Check API_URL in environment
- Clear browser cache
- Check browser console for errors

**Docker issues:**
- Ensure Docker daemon is running
- Check disk space for Docker
- Rebuild images: `docker-compose build --no-cache`

## 📞 Support

For issues or questions, check the logs:
```bash
# Backend logs
npm run dev

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

**Ready for production. Built with ❤️ for scalability and reliability.**
