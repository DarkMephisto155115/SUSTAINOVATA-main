---
description: Repository Information Overview
alwaysApply: true
---

# SUSTAINOVATA Repository Information

## Repository Summary

SUSTAINOVATA is a full-stack web application built with Node.js backend and Vue 3 frontend. The project provides a comprehensive platform for managing programs, publications, and research-related content with an admin dashboard for content management.

## Repository Structure

**Root Level Components:**
- **backend-js/**: Express.js REST API server with authentication, file uploads, and database operations
- **frontend/**: Vue 3 + Vite single-page application with responsive UI
- **db/**: MySQL database schema and SQL initialization scripts

---

## Backend (Node.js)

**Configuration File**: `backend-js/package.json`

### Language & Runtime
**Runtime**: Node.js  
**Language**: JavaScript (CommonJS)  
**Build System**: None (direct Node.js execution)  
**Package Manager**: npm

### Dependencies
**Main Dependencies**:
- `express` (^5.1.0) - Web framework
- `mysql2` (^3.14.1) - MySQL database driver
- `axios` (^1.9.0) - HTTP client
- `cors` (^2.8.5) - Cross-origin resource sharing
- `bcrypt` (^6.0.0) - Password hashing
- `jsonwebtoken` (^9.0.2) - JWT authentication
- `multer` (^2.0.0) - File upload middleware
- `dotenv` (^16.5.0) - Environment variable management

**Development Dependencies**:
- `nodemon` (^3.1.10) - Development server with auto-reload

### Build & Installation
```bash
npm install
npm run dev          # Development server with auto-reload
npm start            # Production server on port 3000
npm run test         # Run all tests
npm run test-db      # Database connection test
npm run test-auth    # Authentication/hashing test
npm run test-up      # File upload test
```

### Application Structure
**Entry Point**: `backend-js/index.js`  
**Configuration**: `backend-js/src/config/env.js` (loads from `.env` file)

**Main Routes**:
- `/api/clients` - Client endpoints
- `/api/admin` - Admin endpoints
- `/api/uploads` - File upload handling
- `/api/images` - Image retrieval

**Core Modules**:
- `src/controllers/` - Route handlers (admin, client, auth)
- `src/routes/` - Route definitions
- `src/middlewares/` - Authentication, CORS middleware
- `src/config/` - Database and environment configuration
- `src/utils/` - Database utilities, upload handlers
- `fileSaved/` - Directory for uploaded files and PDFs

### Environment Configuration
**Port**: 3000  
**Database**: MySQL running on `localhost:3306`  
**JWT Secret**: Configurable via `.env`  
**Database Name**: `sustainovata-db`

### Testing
**Test Framework**: Custom Node.js scripts  
**Test Location**: `backend-js/tests/`  
**Test Files**:
- `tes-db.js` - Database connectivity test
- `tes-hash.js` - Password hashing test
- `tes-upload.js` - File upload functionality test

---

## Frontend (Vue 3 + Vite)

**Configuration File**: `frontend/package.json`

### Language & Runtime
**Framework**: Vue 3 with `<script setup>` SFC syntax  
**Build Tool**: Vite (^6.3.5)  
**Language**: JavaScript (ES Modules)  
**Package Manager**: npm

### Dependencies
**Main Dependencies**:
- `vue` (^3.5.13) - UI framework
- `vue-router` (^4.5.1) - Client-side routing
- `axios` (^1.9.0) - API communication
- `bootstrap` (^5.3.6) - CSS framework
- `bootstrap-icons` (^1.12.1) - Icon library
- `moment` (^2.30.1) - Date/time utilities
- `multer` (^2.0.0) - File handling

**Development Dependencies**:
- `@vitejs/plugin-vue` (^5.2.3) - Vue 3 support for Vite
- `vite` (^6.3.5) - Build tool and dev server

### Build & Installation
```bash
npm install
npm run dev      # Development server (localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

### Application Structure
**Entry Point**: `frontend/src/main.js`  
**Root Component**: `frontend/src/App.vue`

**Main Directories**:
- `src/components/` - Reusable Vue components (Navbar, Footer, Admin components, Card components)
- `src/page/` - Page components for routing (Home, About, Programs, Publications, Auth pages, Admin pages)
- `src/router/` - Vue Router configuration with 20+ routes
- `src/assets/` - Static assets (logos, images, backgrounds)
- `src/utils/` - Utility functions (auth, formatting)

**Key Routes**:
- `/` - Home page
- `/about`, `/programs`, `/publications`, `/news`, `/research`, `/contact` - Public pages
- `/login`, `/register`, `/forgotPass` - Authentication pages
- `/admin/dashboard` - Admin dashboard
- `/admin/kelola/*` - Content management pages
- `/admin/tambah/*` - Content creation pages

### Build Configuration
**Vite Config**: Path aliases configured for shorter imports:
- `@` → `src/`
- `@pages` → `src/page/`
- `@components` → `src/components/`
- `@adminPage` → `src/page/admin/`
- `@images` → `src/assets/images/`

### HTML Entry Point
`frontend/index.html` - Root HTML file with Vue app mount point (`#app`)

---

## Database

**Type**: MySQL  
**Configuration File**: `db/sustainovata-db.sql`  
**Schema Location**: `db/scema/` (database diagram and documentation)

**Initialization**:
```bash
mysql -u root -p sustainovata-db < sustainovata-db.sql
```

**Connection Details** (from `.env`):
- Host: `localhost`
- Port: `3306`
- User: `root`
- Database: `sustainovata-db`

---

## Development Workflow

### Starting Development Environment
**Backend**:
```bash
cd backend-js
npm install
npm run dev      # Runs on http://localhost:3000
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

**Database**:
```bash
# Import schema
mysql -u root -p sustainovata-db < db/sustainovata-db.sql
```

### Building for Production

**Frontend**:
```bash
cd frontend
npm run build    # Creates optimized dist/ folder
```

**Backend**: Ready to run with `npm start` after setting production environment variables
