# Quick Start Guide - SUSTAINOVATA

## 🚀 5-Minute Setup

### Prerequisites
- Node.js v14+
- MySQL 5.7+
- npm or yarn

### 1️⃣ Database Setup (1 min)

```bash
# Import database with new features
mysql -u root -p sustainovata-db < db/migration_new_features.sql

# Verify
mysql -u root -p sustainovata-db -e "SHOW TABLES;"
```

### 2️⃣ Backend Setup (2 min)

```bash
cd backend-js

# Install dependencies
npm install

# Start development server
npm run dev
# Backend ready at http://localhost:3000
```

### 3️⃣ Frontend Setup (2 min)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend ready at http://localhost:5173
```

---

## 🎯 First Time Usage

### Create Test Accounts

**Option 1: Using MySQL**
```sql
-- Admin account
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@test.com', '$2b$10$9KCA/qtpMygoYDJKF.RHku7uZokkfrQFgHMcL0gjpjdgwIdvrCvyy', 'admin');

-- Editor account
INSERT INTO users (name, email, password, role) 
VALUES ('Editor User', 'editor@test.com', '$2b$10$9KCA/qtpMygoYDJKF.RHku7uZokkfrQFgHMcL0gjpjdgwIdvrCvyy', 'editor');

-- Author account
INSERT INTO users (name, email, password, role) 
VALUES ('Author User', 'author@test.com', '$2b$10$9KCA/qtpMygoYDJKF.RHku7uZokkfrQFgHMcL0gjpjdgwIdvrCvyy', 'author');
```

Password untuk semua test accounts: `password123`

**Option 2: Using Register Page**
1. Go to http://localhost:5173/register
2. Create account
3. Update role via MySQL

### Test Each Role

#### 🔑 Admin
```
Email: admin@test.com
Password: password123
URL: http://localhost:5173/admin/dashboard
Features: Manage berita & program
```

#### ✏️ Editor
```
Email: editor@test.com
Password: password123
URL: http://localhost:5173/editor/dashboard
Features: Review journals, manage collaborations
```

#### 👤 Author
```
Email: author@test.com
Password: password123
URL: http://localhost:5173/author/journals
Features: Create & submit journals
```

---

## 📋 Feature Checklist

### ✨ New Features Implemented

- ✅ **Role-Based Access Control** - Admin, Editor, Author
- ✅ **Journal Management** - Create, submit, review, revise
- ✅ **Collaboration System** - Share documents, manage members
- ✅ **Editor Dashboard** - Review journals, statistics
- ✅ **Author Dashboard** - Manage personal journals
- ✅ **UI/UX Improvements** - Better spacing, typography, responsive
- ✅ **Database Schema** - 4 new tables + migrations

### 📚 Documentation

- ✅ `FEATURES.md` - Complete feature guide
- ✅ `IMPLEMENTATION_NOTES.md` - Technical details
- ✅ `IMPLEMENTATION_SUMMARY.md` - What was implemented
- ✅ `DEPLOYMENT.md` - Production deployment
- ✅ `QUICKSTART.md` - This file

---

## 🎬 Quick Feature Demo

### Demo 1: Author Creates Journal

1. Login as author
2. Go to `/author/journals`
3. Click "Create Journal"
4. Fill form:
   - Title: "My First Research"
   - Writer: "John Doe"
   - Keywords: "research, journal"
   - Abstract: "This is a research abstract..."
5. Upload PDF and cover image
6. Click "Create & Submit for Review"
7. Journal status: `pending_review`

### Demo 2: Editor Reviews Journal

1. Login as editor
2. Go to `/editor/dashboard`
3. See "Pending Review: 1"
4. Click journal to review
5. Read full journal details
6. Click "Provide Review"
7. Select decision: "Approve" / "Request Revision" / "Reject"
8. Add feedback
9. Submit review
10. Journal status updated

### Demo 3: Author Uploads Revision

1. Login as author
2. See journal with status `revision_needed`
3. Click journal
4. Scroll to "Upload Revision"
5. Select revised PDF file
6. Click "Upload Revision"
7. File uploaded, back to editor review

### Demo 4: Editor Collaboration

1. Login as editor
2. Go to `/editor/collaborations`
3. Click "New Collaboration"
4. Fill title & description
5. Upload document file
6. Click "Create"
7. Click collaboration to see details
8. Add member with email
9. Set member role (viewer/editor)

---

## 🔧 Common Commands

### Backend
```bash
cd backend-js

# Development
npm run dev

# Production
npm start

# Test database
npm run test-db

# Test authentication
npm run test-auth

# Test file upload
npm run test-up
```

### Frontend
```bash
cd frontend

# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Database
```bash
# Backup database
mysqldump -u root -p sustainovata-db > backup.sql

# Restore database
mysql -u root -p sustainovata-db < backup.sql

# Check tables
mysql -u root -p sustainovata-db -e "SHOW TABLES;"

# Check data
mysql -u root -p sustainovata-db -e "SELECT * FROM users;"
```

---

## 📂 Project Structure

```
SUSTAINOVATA/
├── backend-js/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── admin/
│   │   │   ├── client/
│   │   │   │   └── authorJournalController.js (NEW)
│   │   │   └── editor/ (NEW)
│   │   ├── middlewares/
│   │   │   └── authorization.js (NEW)
│   │   ├── routes/
│   │   │   ├── editorRoutes.js (NEW)
│   │   │   └── authorRoutes.js (NEW)
│   │   └── fileSaved/
│   │       ├── pdf/
│   │       ├── images/
│   │       └── collaborations/ (NEW)
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── page/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── editor/ (NEW)
│   │   │   └── author/ (NEW)
│   │   ├── components/
│   │   ├── router/
│   │   └── style.css (UPDATED)
│   ├── vite.config.js
│   └── package.json
│
├── db/
│   ├── sustainovata-db.sql
│   └── migration_new_features.sql (NEW)
│
├── FEATURES.md (NEW)
├── IMPLEMENTATION_NOTES.md (NEW)
├── IMPLEMENTATION_SUMMARY.md (NEW)
├── DEPLOYMENT.md (NEW)
└── QUICKSTART.md (this file)
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check port 3000 not in use
lsof -i :3000

# Check .env file exists
cat backend-js/.env

# Check database connection
mysql -u root -p -e "SELECT 1"
```

### Frontend shows blank page
```bash
# Check .env or API URL
# Should be http://localhost:3000 for development

# Clear cache
rm -rf frontend/node_modules/.vite
npm run dev
```

### Database migration fails
```bash
# Check MySQL version
mysql --version

# Run migration manually
mysql -u root -p sustainovata-db < db/migration_new_features.sql

# Check for errors
mysql -u root -p sustainovata-db -e "SHOW ERRORS;"
```

### Can't upload files
```bash
# Create upload directories
mkdir -p backend-js/src/fileSaved/{pdf,images,collaborations}

# Fix permissions
chmod -R 755 backend-js/src/fileSaved
```

### Login not working
```bash
# Check users table
mysql -u root -p sustainovata-db -e "SELECT * FROM users;"

# Check JWT secret in .env
cat backend-js/.env | grep JWT_SECRET
```

---

## 📞 File Locations Reference

| File | Location | Purpose |
|------|----------|---------|
| Database Schema | `db/migration_new_features.sql` | New tables & migrations |
| Admin Dashboard | `frontend/src/page/admin/` | Admin pages |
| Editor Dashboard | `frontend/src/page/editor/` | Editor pages |
| Author Pages | `frontend/src/page/author/` | Author pages |
| Editor Controller | `backend-js/src/controllers/editor/` | Review logic |
| Author Controller | `backend-js/src/controllers/client/authorJournalController.js` | Journal logic |
| Authorization | `backend-js/src/middlewares/authorization.js` | Role checking |
| Routes | `backend-js/src/routes/` | API endpoints |
| Styles | `frontend/src/style.css` | Global styles |

---

## 🎓 Learning Path

1. **Start Here**: This file (QUICKSTART.md)
2. **Features Guide**: Read `FEATURES.md`
3. **Technical Details**: Read `IMPLEMENTATION_NOTES.md`
4. **What's Included**: Read `IMPLEMENTATION_SUMMARY.md`
5. **Deploy**: Follow `DEPLOYMENT.md` for production

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:5173
- [ ] Can login with test accounts
- [ ] Admin can access `/admin/dashboard`
- [ ] Editor can access `/editor/dashboard`
- [ ] Author can access `/author/journals`
- [ ] Can create journal as author
- [ ] Journal appears in editor's pending list
- [ ] Can provide review as editor
- [ ] File uploads working
- [ ] UI looks good on mobile

---

## 🚀 Next Steps

1. **Development**
   - Read FEATURES.md for detailed features
   - Explore code in backend-js/ and frontend/
   - Test all workflows

2. **Production**
   - Follow DEPLOYMENT.md
   - Set strong JWT_SECRET
   - Configure SSL/TLS
   - Setup backups

3. **Enhancement**
   - Add unit tests
   - Add email notifications
   - Add real-time collaboration
   - Add advanced search

---

## 📞 Support

For issues:
1. Check troubleshooting section
2. Review logs (check terminal output)
3. Read relevant documentation files
4. Check database state

---

## 🎉 You're Ready!

The system is now set up and ready for testing and development.

Happy coding! 🚀

