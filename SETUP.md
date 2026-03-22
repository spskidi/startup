# Setup & Installation Guide

## 📋 System Requirements

- Node.js v16+ and npm
- MongoDB 4.4+
- Git
- 2GB RAM minimum
- 500MB free disk space

## 🔧 Installation Steps

### Step 1: Clone/Download Project

```bash
cd e:\startup-business
```

### Step 2: Backend Setup

```bash
cd ecommerce-platform/backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your credentials
# MONGODB_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/ecommerce
# JWT_SECRET=your_secret_key_here
# PORT=5000
```

### Step 3: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
API is ready at http://localhost:5000/api
```

### Step 4: Frontend Setup (New Terminal)

```bash
cd ecommerce-platform/frontend

# Install dependencies
npm install

# Create environment file (optional, defaults work fine)
echo REACT_APP_API_URL=http://localhost:5000/api > .env
```

### Step 5: Start Frontend Application

```bash
npm start
```

This will automatically open:
```
http://localhost:3000
```

## 🗄️ MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account
4. Create a new project
5. Create a Cluster (free tier available)
6. Go to Network Access, add 0.0.0.0/0 (for development)
7. Go to Database Access, create user with password
8. Get connection string from "Connect" button
9. Format: `mongodb+srv://username:password@cluster0.mongodb.net/ecommerce`

### Option B: Local MongoDB

**Windows:**
```bash
# Install MongoDB Community Edition from
# https://www.mongodb.com/try/download/community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb
```

Connection string for local: `mongodb://localhost:27017/ecommerce`

## 🐳 Docker Installation (Optional)

### Prerequisites
- Install Docker: https://www.docker.com/products/docker-desktop
- Install Docker Compose (included with Docker Desktop)

### Start with Docker

```bash
cd ecommerce-platform

# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: mongodb://mongodb:27017 (internal)

## 📝 Test Accounts

After first startup, create test accounts:

**As a Customer:**
1. Go to http://localhost:3000
2. Click "Join"
3. Select "Customer"
4. Fill form:
   - Name: John Doe
   - Email: customer@test.com
   - Phone: 9876543210
   - Password: test123

**As a Shopkeeper:**
1. Click "Join"
2. Select "Shopkeeper"
3. Fill form:
   - Name: Shop Owner
   - Email: seller@test.com
   - Phone: 9876543211
   - Password: test123
   - Shop Name: My Shop

## ✅ Verification

### Check Backend
```
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "API is running",
  "timestamp": "2024-02-26T10:30:00Z"
}
```

### Check Products Endpoint
```
curl http://localhost:5000/api/products
```

### Frontend Check
Open http://localhost:3000 in browser
You should see the homepage with featured products

## 🔧 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:**
- Verify MongoDB is running
- Check connection string in .env
- Ensure username/password are correct
- Check network connectivity for Atlas

### Issue: "Cannot find module"
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 or 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: Frontend shows blank page
**Solution:**
- Check browser console for errors (F12)
- Verify backend is running
- Clear browser cache (Ctrl+Shift+Delete)
- Check REACT_APP_API_URL environment variable

### Issue: CORS errors
**Solution:**
- Ensure backend is running before frontend
- Check CORS configuration in server.js
- Verify API URL matches in .env

## 📊 Project Structure

```
ecommerce-platform/
├── backend/
│   ├── models/          # Database schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   ├── server.js        # Main server file
│   ├── package.json     # Dependencies
│   └── .env.example     # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # State management
│   │   ├── utils/       # Helper functions
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   ├── public/          # Static files
│   ├── package.json     # Dependencies
│   └── tailwind.config.js
├── docker-compose.yml   # Docker configuration
└── README.md           # Documentation
```

## 🚀 Next Steps

1. **Create Products** (as Shopkeeper)
   - Go to /shopkeeper/dashboard
   - Click "Add Product"
   - Fill product details with quantity > 10

2. **Browse Products** (as Customer)
   - Go to /products
   - Products with quantity > 10 will be visible

3. **Make a Purchase**
   - Add products to cart
   - Go to /cart
   - Proceed to checkout
   - Place order

4. **Track Order**
   - View in customer orders page
   - Shopkeeper can update status

## 💡 Development Tips

- Use Chrome DevTools for debugging
- Check browser console for frontend errors
- Use Postman to test API endpoints
- MongoDB Compass for database visualization
- Keep terminals organized (separate for backend and frontend)

## 🌐 Accessing from Other Machines

### Local Network Access
Change frontend .env to:
```
REACT_APP_API_URL=http://<YOUR_LOCAL_IP>:5000/api
```

Get your local IP:
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` (look for inet address)

Access from other machine:
```
http://<YOUR_LOCAL_IP>:3000
```

## 📈 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production setup instructions.

Key points:
- Use strong JWT_SECRET
- Enable HTTPS
- Use environment-appropriate database
- Set up proper logging
- Configure security headers
- Enable rate limiting

## 🎓 Learning Resources

- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- JWT: https://jwt.io

---

**Happy coding! 🚀**
