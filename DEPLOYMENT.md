# Deployment Guide - SUSTAINOVATA

## Pre-Deployment Checklist

### Backend
- [ ] Review .env file
- [ ] Database migration tested locally
- [ ] All dependencies installed
- [ ] Error handling verified
- [ ] File upload paths configured
- [ ] JWT secret set to strong value

### Frontend
- [ ] All routes tested
- [ ] API endpoints updated for production
- [ ] Build verified: `npm run build`
- [ ] dist/ folder generated
- [ ] No console errors
- [ ] Responsive design tested

### Database
- [ ] Backup created
- [ ] Migration scripts backed up
- [ ] Foreign key constraints verified
- [ ] Indexes created

---

## Step 1: Database Setup

### 1.1 Create Database
```bash
mysql -u root -p
> CREATE DATABASE sustainovata-db;
> USE sustainovata-db;
```

### 1.2 Apply Base Schema
```bash
mysql -u root -p sustainovata-db < db/sustainovata-db.sql
```

### 1.3 Apply New Features Migration
```bash
mysql -u root -p sustainovata-db < db/migration_new_features.sql
```

### 1.4 Verify Tables
```sql
SHOW TABLES;
-- Should show:
-- berita, collaborations, collaboration_members, journal_reviews
-- journal_versions, jurnal, news, peserta_programs, programs, users
```

### 1.5 Create Backup
```bash
mysqldump -u root -p sustainovata-db > backup_$(date +%Y%m%d).sql
```

---

## Step 2: Backend Setup

### 2.1 Environment Configuration

**File:** `backend-js/.env`

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=YourStrongPassword
DB_NAME=sustainovata-db

# JWT Configuration
JWT_SECRET=YourVeryStrongSecretKey123456789!@#$%^&*()
JWT_EXPIRES_IN=24h

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=src/fileSaved
```

### 2.2 Install Dependencies
```bash
cd backend-js
npm install
```

### 2.3 Create Upload Directories
```bash
mkdir -p src/fileSaved/{pdf,images/jurnal,images/berita,images/program,collaborations}
chmod -R 755 src/fileSaved
```

### 2.4 Test Backend
```bash
npm run dev  # Development testing
```

### 2.5 Production Build
```bash
npm install -g pm2  # Process manager (optional)
pm2 start index.js --name sustainovata-backend
pm2 save
pm2 startup
```

Or using systemd service:

**File:** `/etc/systemd/system/sustainovata-backend.service`

```ini
[Unit]
Description=SUSTAINOVATA Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/sustainovata/backend-js
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable sustainovata-backend
sudo systemctl start sustainovata-backend
```

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

### 3.2 Update API Configuration

**File:** `frontend/src/main.js` or create `.env`

```javascript
// For development
const API_URL = 'http://localhost:3000/api';

// For production
const API_URL = 'https://api.yourdomain.com/api';
```

Or in vite.config.js:
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

### 3.3 Build for Production
```bash
npm run build
```

Output: `dist/` folder

### 3.4 Test Build Locally
```bash
npm run preview
```

Visit: http://localhost:4173

---

## Step 4: Web Server Configuration

### Using Nginx (Recommended)

**File:** `/etc/nginx/sites-available/sustainovata`

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    root /var/www/sustainovata/frontend/dist;
    index index.html;

    # Vue Router fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File uploads and images
    location /uploads/ {
        alias /var/www/sustainovata/backend-js/src/fileSaved/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1024;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/sustainovata /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Using Apache

**File:** `/etc/apache2/sites-available/sustainovata.conf`

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    
    # Frontend
    DocumentRoot /var/www/sustainovata/frontend/dist
    
    # Vue Router fallback
    <Directory /var/www/sustainovata/frontend/dist>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
        
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteRule ^index\.html$ - [L]
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>
    
    # API proxy
    ProxyPreserveHost On
    ProxyPass /api http://127.0.0.1:3000/api
    ProxyPassReverse /api http://127.0.0.1:3000/api
    
    # File uploads
    Alias /uploads /var/www/sustainovata/backend-js/src/fileSaved
    <Directory /var/www/sustainovata/backend-js/src/fileSaved>
        Options FollowSymLinks
        Require all granted
    </Directory>
    
    # SSL
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem
</VirtualHost>
```

Enable modules:
```bash
sudo a2enmod proxy proxy_http rewrite ssl
sudo a2ensite sustainovata
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## Step 5: SSL/TLS Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

Auto-renewal:
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Step 6: Database Backup & Maintenance

### Automated Backup Script

**File:** `/usr/local/bin/backup-sustainovata.sh`

```bash
#!/bin/bash

DB_USER="root"
DB_PASS="password"
DB_NAME="sustainovata-db"
BACKUP_DIR="/var/backups/sustainovata"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Keep last 30 days
find $BACKUP_DIR -name "db_*.sql" -mtime +30 -delete

# Keep last 10 backups
ls -t $BACKUP_DIR/db_*.sql | tail -n +11 | xargs rm -f
```

Make executable and add to crontab:
```bash
sudo chmod +x /usr/local/bin/backup-sustainovata.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-sustainovata.sh
```

---

## Step 7: Monitoring & Logging

### Backend Logs

Using PM2:
```bash
pm2 logs sustainovata-backend
pm2 save
```

Or with systemd:
```bash
sudo journalctl -u sustainovata-backend -f
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Health Check Endpoint (Optional)

Add to backend:
```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

Monitor with:
```bash
curl https://yourdomain.com/api/health
```

---

## Step 8: Performance Optimization

### Frontend - HTTP/2 Push
In Nginx:
```nginx
http2_push_resource "/css/style.css";
http2_push_resource "/js/main.js";
```

### Database Optimization
```sql
-- Analyze tables
ANALYZE TABLE users, jurnal, journal_reviews;

-- Check index usage
SHOW INDEX FROM jurnal;
```

### Caching Headers

In Nginx:
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Don't cache index.html
location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## Step 9: Testing Production Setup

### Backend Tests
```bash
# Check backend is running
curl https://yourdomain.com/api/health

# Test API endpoint
curl -X GET https://yourdomain.com/api/clients
```

### Frontend Tests
```bash
# Check frontend loads
curl https://yourdomain.com/

# Test all routes work
# Visit each main route in browser
```

### Database Tests
```bash
# SSH into server and test
mysql -u root -p sustainovata-db -e "SELECT COUNT(*) FROM users;"
```

---

## Step 10: Post-Deployment

### 1. Create Admin User
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@example.com', '$2b$10$...hashed_password...', 'admin');
```

### 2. Create Test Editor User
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Editor', 'editor@example.com', '$2b$10$...hashed_password...', 'editor');
```

### 3. Test All Features
- [ ] Admin login & manage berita/program
- [ ] Editor login & review journals
- [ ] Author login & create journal
- [ ] Test all workflows

### 4. Security Hardening
```bash
# File permissions
sudo chown -R www-data:www-data /var/www/sustainovata
sudo chmod -R 755 /var/www/sustainovata
sudo chmod 700 /var/www/sustainovata/backend-js/src/fileSaved

# Firewall
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
```

### 5. Monitoring Setup
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Setup alerts
# - CPU usage
# - Disk space
# - Memory usage
# - Database connections
```

---

## Troubleshooting

### Backend not connecting to database
```bash
# Check connection
mysql -h localhost -u root -p -e "USE sustainovata-db; SHOW TABLES;"

# Check .env file
cat backend-js/.env

# Check MySQL is running
sudo systemctl status mysql
```

### Frontend showing blank page
```bash
# Check dist folder exists
ls -la frontend/dist/

# Check index.html
cat frontend/dist/index.html

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### File uploads not working
```bash
# Check directory permissions
ls -la backend-js/src/fileSaved/

# Fix permissions
sudo chmod -R 755 backend-js/src/fileSaved
sudo chown -R www-data:www-data backend-js/src/fileSaved
```

### CORS errors
```bash
# Update corsOptions in backend-js/src/middlewares/middleWareCors.js
# Frontend URL harus match dengan origin
```

---

## Rollback Procedure

### Quick Rollback
```bash
# Stop services
sudo systemctl stop sustainovata-backend
sudo systemctl stop nginx

# Restore database
mysql -u root -p sustainovata-db < backup_previous.sql

# Restore frontend
rm -rf frontend/dist/*
tar -xzf frontend-dist-backup.tar.gz -C frontend/

# Restore backend
rm -rf backend-js/src/fileSaved/*
tar -xzf backend-fileSaved-backup.tar.gz -C backend-js/

# Start services
sudo systemctl start sustainovata-backend
sudo systemctl start nginx
```

---

## Monitoring Checklist

Daily:
- [ ] Check server status
- [ ] Check disk space
- [ ] Check database size
- [ ] Review error logs

Weekly:
- [ ] Verify backups
- [ ] Check SSL certificate expiry
- [ ] Review performance metrics
- [ ] Test user workflows

Monthly:
- [ ] Database optimization
- [ ] Security updates
- [ ] Create fresh backup
- [ ] Test disaster recovery

---

## Support & Documentation

- **Issues:** Review logs and troubleshooting section
- **Documentation:** See FEATURES.md and IMPLEMENTATION_NOTES.md
- **API Reference:** REST API documentation
- **Architecture:** See IMPLEMENTATION_NOTES.md

