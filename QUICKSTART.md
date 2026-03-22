# Quick Start Guide - Step by Step

## ⚡ 5-Minute Setup

### Step 1: Navigate to Project
```bash
cd e:\startup-business\ecommerce-platform
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

Expected: Browser opens at http://localhost:3000

### Step 4: Test Application
✅ Go to http://localhost:3000
✅ Click "Join" to register
✅ Create a test account

---

## 📋 Pre-Setup Checklist

- [ ] Node.js v16+ installed? `node --version`
- [ ] MongoDB setup? (local or Atlas)
- [ ] Git installed?
- [ ] Two terminals/command prompts ready?

---

## 🚀 Environment Setup

### For MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Create backend/.env:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxx.mongodb.net/ecommerce
JWT_SECRET=your_random_secret_key_here_32_chars_min
PORT=5000
NODE_ENV=development
```

### For Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_random_secret_key_here_32_chars_min
PORT=5000
NODE_ENV=development
```

---

## 📖 File Reference

| File | Purpose |
|------|---------|
| README.md | Main documentation |
| SETUP.md | Detailed installation |
| DEPLOYMENT.md | Production guide |
| API.md | API endpoints |
| PROJECT_SUMMARY.md | What's included |

---

## 🎯 Test Workflows

### Test as Customer

1. **Register**
   - Email: customer@test.com
   - Password: test123
   - Click "Customer" role
   - Register

2. **Browse Products**
   - Shopkeeper must add products first
   - Go to /products
   - Search, filter, view details

3. **Add to Cart**
   - Click "Add to Cart" on product
   - Go to /cart
   - See cart items

4. **Checkout**
   - Click "Proceed to Checkout"
   - Fill shipping address
   - Select payment method
   - Place order

5. **View Orders**
   - Go to "My Orders" (header)
   - Click order to see details

### Test as Shopkeeper

1. **Register**
   - Email: seller@test.com
   - Password: test123
   - Click "Shopkeeper" role
   - Shop Name: MyShop
   - Register

2. **Add Product**
   - Go to Dashboard (in header)
   - Click "Add Product"
   - Fill details:
     - Name: Product Name
     - Category: Electronics
     - Price: 999
     - Quantity: 50 (MUST be > 10)
     - Description: Some text
   - Click "Save Product"

3. **Check Listing**
   - Product appears in /products (quantity > 10)
   - Customer can see it

4. **Reduce Quantity**
   - Edit product
   - Change quantity to 5
   - Save

5. **Check Unlisting**
   - Product disappears from /products
   - Customer cannot see it anymore
   - You still see it in Dashboard

6. **Increase Quantity**
   - Edit product
   - Change quantity back to 15
   - Save

7. **Product Relists**
   - Now visible in /products again!
   - Customers can see and buy

---

## 🐳 Docker Quick Start

```bash
cd ecommerce-platform

# Build and start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop
docker-compose down

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- MongoDB: localhost:27017

---

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is running
# Check connection string in .env
# Ensure port 5000 is free

# Reset
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend shows blank page
```bash
# Clear browser cache
Ctrl + Shift + Delete

# Check console
F12 → Console tab

# Verify backend running
curl http://localhost:5000/api/health
```

### Cannot see products
- Shopkeeper must add product with quantity > 10
- Wait 2-3 seconds after adding
- Refresh page
- Check /products page

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 📊 Key API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","phone":"9876543210","role":"customer"}'

# Get products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/products/categories
```

---

## 🎨 Frontend Routes

| Route | Purpose |
|-------|---------|
| / | Home page |
| /login | Login |
| /register | Register |
| /products | Product listing |
| /product/:id | Product details |
| /cart | Shopping cart |
| /checkout | Checkout |
| /orders | My orders |
| /orders/:id | Order details |
| /shopkeeper/dashboard | Seller dashboard |

---

## 🔐 Test Credentials

```
Customer Test Account:
Email: customer@test.com
Password: test123

Shopkeeper Test Account:
Email: seller@test.com
Password: test123
```

Create these manually through registration flow.

---

## 📈 What to Test

### Functionality
- [ ] Register as customer
- [ ] Register as shopkeeper
- [ ] Login/Logout
- [ ] Add product (as shopkeeper)
- [ ] Search products
- [ ] Filter by category
- [ ] View product details
- [ ] Add to cart
- [ ] Remove from cart
- [ ] Update quantity
- [ ] Checkout
- [ ] Place order
- [ ] View orders
- [ ] Cancel order
- [ ] Auto-listing (quantity ≤ 10)

### Security
- [ ] Logout clears token
- [ ] Protected routes redirect to login
- [ ] Shopkeeper can't access customer features
- [ ] Customer can't see admin features
- [ ] Wrong password fails login
- [ ] Duplicate email rejected

### Performance
- [ ] Pages load quickly
- [ ] No console errors
- [ ] Search responds fast
- [ ] Cart updates instantly

---

## 💾 Database Backup

```bash
# Export MongoDB data
mongodump --uri="mongodb+srv://user:pass@cluster/db" \
  --archive=backup.archive

# Restore
mongorestore --archive=backup.archive
```

---

## 🔗 Useful Links

- Node.js: https://nodejs.org
- MongoDB: https://www.mongodb.com
- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- Tailwind CSS: https://tailwindcss.com
- JWT: https://jwt.io

---

## 📞 Need Help?

1. **Check the logs**
   - Backend: `npm run dev`
   - Frontend: Browser F12 → Console

2. **Read documentation**
   - SETUP.md - Installation
   - API.md - Endpoints
   - DEPLOYMENT.md - Production

3. **Common issues**
   - MongoDB not connected → Check .env
   - Products not showing → Quantity must be > 10
   - Login fails → Check credentials

---

## 🎉 Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register as customer
- [ ] Can register as shopkeeper
- [ ] Can login with test accounts
- [ ] Can add product (quantity > 10)
- [ ] Product visible in customer view
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can place order

**If all checked ✅ - You're ready to launch!**

---

## 🚀 Next: Production Deployment

When ready to deploy:
1. Read DEPLOYMENT.md
2. Get your own domain
3. Setup SSL certificate
4. Configure environment variables
5. Deploy to cloud (AWS, Heroku, DigitalOcean, etc.)

---

**Ready to go? Start with:**
```bash
cd backend
npm run dev
```

**Then in another terminal:**
```bash
cd frontend
npm start
```

**Happy building! 🚀**
