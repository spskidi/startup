# Production Deployment Guide

## 🚀 Deployment Checklist

- [ ] Security audit completed
- [ ] Environment variables configured
- [ ] Database backups setup
- [ ] SSL/HTTPS certificate obtained
- [ ] Monitoring configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Logging setup done

## 📋 Pre-Deployment Tasks

### 1. Security Hardening

**Update security variables:**
```bash
# Generate strong JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set strong MongoDB password
# Use complex password: Min 8 chars, uppercase, lowercase, numbers, special chars
```

**Remove debug information:**
```javascript
// server.js - Set NODE_ENV to production
process.env.NODE_ENV = 'production';
```

**Enable HTTPS:**
```javascript
// Use reverse proxy (Nginx) for SSL termination
// Or use Let's Encrypt certificates
```

### 2. Database Preparation

**MongoDB Atlas Production Setup:**
1. Create dedicated admin user
2. Setup IP whitelist (not 0.0.0.0)
3. Enable encryption at rest
4. Configure daily backups
5. Setup monitoring alerts

**Backup Strategy:**
```bash
# Automated daily backups
mongodump --uri="mongodb+srv://user:pass@cluster/db" --archive=backup.archive

# Restore from backup
mongorestore --archive=backup.archive
```

### 3. Environment Configuration

**Production .env:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://produser:strongpass@prod-cluster.mongodb.net/ecommerce

# Security
JWT_SECRET=your_very_long_random_secret_32_chars_minimum
JWT_EXPIRY=7d
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Payment
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxx

# Logging
LOG_LEVEL=info
```

## 🐳 Docker Deployment

### Option 1: Using Docker Compose

**Production docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    image: ecommerce-backend:latest
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb+srv://user:pass@cluster/db
      JWT_SECRET: ${JWT_SECRET}
    restart: always
    healthcheck:
      test: curl --fail http://localhost:5000/api/health || exit 1
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: ecommerce-frontend:latest
    ports:
      - "80:3000"
    environment:
      REACT_APP_API_URL: https://api.yourdomain.com
    restart: always
```

**Deploy:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Cloud Platforms

**Heroku:**
```bash
heroku login
heroku create ecommerce-api
heroku config:set JWT_SECRET=xxxx
heroku config:set MONGODB_URI=mongodb+srv://...

git push heroku main
```

**AWS EC2:**
```bash
# Launch Ubuntu 20.04 instance
# Install Docker and Docker Compose
# Clone repository
# Run docker-compose up -d
```

**DigitalOcean App Platform:**
```bash
# Connect GitHub repository
# Add environment variables in dashboard
# Deploy automatically on push
```

**AWS RDS for MongoDB:**
```bash
# Use managed MongoDB service
# Reduces operational overhead
# Better for production
```

## 🔒 Security Configuration

### 1. Nginx Reverse Proxy Setup

**Install Nginx:**
```bash
sudo apt-get update
sudo apt-get install nginx
```

**Configure Nginx (/etc/nginx/sites-available/default):**
```nginx
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # GZIP compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        root /var/www/ecommerce/frontend/build;
        try_files $uri /index.html;
    }
}
```

### 2. SSL Certificate

**Using Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Firewall Configuration

```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

**Using PM2 (Process Manager):**
```bash
npm install -g pm2

# Start application
pm2 start server.js --name "ecommerce-api"

# Monitor
pm2 monit

# Setup auto-restart
pm2 startup
pm2 save
```

**Track logs:**
```bash
pm2 logs ecommerce-api
```

### 2. Database Monitoring

**MongoDB Atlas:**
- Go to cluster → Monitoring
- Set up alerts for:
  - High CPU usage
  - Memory consumption
  - Connection count
  - Query performance

### 3. Logging Stack

**Install Winston logger:**
```bash
npm install winston
```

**Configure logging:**
```javascript
const logger = require('winston');
logger.info('Application started in production');
logger.error('Database connection failed', error);
```

### 4. Uptime Monitoring

**Using UptimeRobot:**
- Go to https://uptimerobot.com
- Add monitors for:
  - API endpoint: https://api.yourdomain.com/api/health
  - Frontend URL: https://yourdomain.com
- Get email alerts for downtime

## 🔧 Scaling Considerations

### 1. Load Balancing

As traffic grows:
```nginx
upstream backend_pool {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}
```

Use PM2 cluster mode:
```bash
pm2 start server.js -i max
```

### 2. Database Optimization

```javascript
// Add indexes
user.createIndex({ email: 1 });
product.createIndex({ shopkeeperId: 1, isListed: 1 });
order.createIndex({ customerId: 1, createdAt: -1 });

// Enable replication in MongoDB Atlas
// For automatic failover
```

### 3. Caching

```javascript
// Add Redis for caching
const redis = require('redis');
const client = redis.createClient();

// Cache product listings
app.get('/products', async (req, res) => {
    const cached = await client.get('products');
    if (cached) return res.json(JSON.parse(cached));
    
    // Fetch from DB
    const data = await Product.find();
    await client.set('products', JSON.stringify(data), 'EX', 3600);
    res.json(data);
});
```

## 📈 Performance Optimization

### 1. API Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### 2. Database Connection Pooling

```javascript
mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 5,
});
```

### 3. CDN for Static Assets

- Upload frontend build to CloudFront/Cloudflare
- Serve product images from CDN
- Reduces server bandwidth usage

## 🆘 Troubleshooting Production

### Check Services Status
```bash
# Docker containers
docker ps

# Nginx
sudo systemctl status nginx

# PM2
pm2 status
```

### View Logs
```bash
# Docker logs
docker logs ecommerce-backend
docker logs ecommerce-frontend

# System logs
tail -f /var/log/nginx/error.log
pm2 logs
```

### Restart Services
```bash
# Docker
docker-compose restart backend

# Nginx
sudo systemctl restart nginx

# PM2
pm2 restart ecommerce-api
```

## 📊 Backup & Recovery

### Automated Backups

**Backup script (backup.sh):**
```bash
#!/bin/bash

BACKUP_DIR="/backups/ecommerce"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup MongoDB
mongodump --uri="$MONGODB_URI" \
    --archive="$BACKUP_DIR/mongodb_$TIMESTAMP.archive"

# Backup application files
tar -czf "$BACKUP_DIR/app_$TIMESTAMP.tar.gz" /app

# Keep last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

**Schedule with cron:**
```bash
crontab -e

# Add line:
0 2 * * * /scripts/backup.sh
```

## 🎯 Post-Deployment

1. **Test all endpoints** with different user roles
2. **Load test** the application
3. **Test payment flow** with test cards
4. **Verify email notifications** (if implemented)
5. **Monitor error logs** for first week
6. **Gather performance metrics**

## 📞 Rollback Procedure

```bash
# If deployment fails
git revert HEAD

# Or restore from backup
docker-compose down
docker image rm ecommerce-backend:latest
docker image rm ecommerce-frontend:latest

# Restore DB
mongorestore --archive=/backups/mongodb_backup.archive

docker-compose up -d
```

---

**Deployment checklist complete? You're ready for production! 🚀**
