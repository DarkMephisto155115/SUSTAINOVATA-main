# SUSTAINOVATA - New Features Documentation

## 🎯 Overview

Fitur-fitur baru berikut telah diimplementasikan untuk meningkatkan platform SUSTAINOVATA:

1. **Role-Based Access Control (RBAC)** - Admin, Editor, Author
2. **Journal Management System** - Sistem pengelolaan jurnal dengan review workflow
3. **Collaboration System** - Sharing dokumen dan kolaborasi antar pengguna
4. **UI/UX Improvements** - Perbaikan tampilan, spacing, typography, dan responsiveness

---

## 📊 Role-Based System

### Roles dan Permissions

#### **Admin** (Management Role)
- ✅ CRUD Berita (News)
- ✅ CRUD Program
- ✅ View dashboard statistics
- ❌ Tidak bisa manage jurnal
- ❌ Tidak bisa manage kolaborasi

#### **Editor** (Content Review Role)
- ✅ CRUD Kolaborasi (Sharing Dokumen)
- ✅ CRUD Jurnal Reviews (Bimbingan Jurnal)
- ✅ Review dan approve/reject jurnal
- ✅ View pending journals
- ✅ Provide feedback kepada author
- ❌ Tidak bisa manage berita
- ❌ Tidak bisa manage program

#### **Author** (Content Creator Role - default user)
- ✅ Create & manage personal journals (draft status)
- ✅ Submit jurnal untuk review
- ✅ Upload revisi berdasarkan feedback editor
- ✅ View status jurnal
- ✅ View review history dan feedback
- ❌ Tidak bisa review jurnal orang lain

---

## 📝 Journal Management System

### Workflow Jurnal

```
Draft → Submit for Review → Pending Review → Editor Reviews
                                                    ↓
                                    ┌───────────────┼───────────────┐
                                    ↓               ↓               ↓
                              Approved        Needs Revision    Rejected
                                ↓                   ↓
                            Published         Author Upload Revision
                                                    ↓
                                            Back to Editor Review
```

### Author - Membuat Jurnal Baru

**Route:** `/author/journals/create`

**Features:**
- Fill form dengan title, writer, keywords, abstract, DOI
- Upload file PDF
- Upload cover image (optional)
- Save as draft atau langsung submit untuk review

**API Endpoints:**
```
POST /api/author/journals
- Create new journal (as draft)

POST /api/author/journals
- Create dan langsung submit untuk review (create & submit flow)
```

### Author - Manage Journals

**Route:** `/author/journals`

**Features:**
- View daftar semua jurnal dengan status
- Statistics: Draft, Pending Review, Published, Rejected
- Edit jurnal (only when status = draft)
- Delete jurnal (only when status = draft)
- Upload revisi jika status = revision_needed

**API Endpoints:**
```
GET /api/author/journals
- Get semua jurnal milik author

GET /api/author/journals/:id
- Get detail jurnal + reviews + versions

PUT /api/author/journals/:id
- Update jurnal (hanya untuk draft)

DELETE /api/author/journals/:id
- Delete jurnal (hanya untuk draft)

POST /api/author/journals/:id/submit-review
- Submit jurnal untuk di-review editor

POST /api/author/journals/:id/upload-revision
- Upload file revisi sesuai feedback editor
```

### Editor - Review Journals

**Route:** `/editor/dashboard`

**Features:**
- Dashboard dengan statistics:
  - Pending Review count
  - Approved count
  - Needs Revision count
- Daftar jurnal yang pending review
- Quick link ke collaboration

**Route:** `/editor/journal/:id`

**Features:**
- View lengkap jurnal dari author
- Download PDF document
- View cover image
- Review history
- Form untuk provide review:
  - Decision: Approve / Request Revision / Reject
  - Feedback untuk author
  - Revision notes dengan detail requirements

**API Endpoints:**
```
GET /api/editor/journals/pending
- Get daftar jurnal pending review

GET /api/editor/journals/:id
- Get detail jurnal + review history

POST /api/editor/journals/:id/review
- Create/submit review untuk jurnal

PUT /api/editor/reviews/:id
- Update review yang sudah ada

GET /api/editor/dashboard/stats
- Get statistics untuk editor dashboard
```

### Journal Status Flow

- **draft** - Jurnal baru, belum di-submit
- **pending_review** - Menunggu review dari editor
- **under_revision** - Author sedang mengupload revisi
- **revision_needed** - Editor minta revisi
- **published** - Approved oleh editor
- **rejected** - Ditolak oleh editor

---

## 🤝 Collaboration System

### Membuat Kolaborasi

**Route:** `/editor/collaborations`

**Features:**
- Create new collaboration document
- Upload file dokumen
- Add title dan description
- Set visibility: private / public
- Add members dengan role: owner / editor / viewer

### Manage Collaborations

**Features:**
- View semua kolaborasi yang dimiliki
- View collaborations yang kita join
- Add members ke kolaborasi
- Remove members
- Update kolaborasi details
- Delete kolaborasi

**Member Roles:**
- **owner** - Membuat, modify, manage members
- **editor** - Bisa edit dokumen
- **viewer** - Hanya bisa view dokumen

**API Endpoints:**
```
POST /api/editor/collaborations
- Create collaboration baru

GET /api/editor/collaborations
- Get semua collaboration

GET /api/editor/collaborations/:id
- Get detail collaboration + members

PUT /api/editor/collaborations/:id
- Update collaboration

DELETE /api/editor/collaborations/:id
- Delete collaboration

POST /api/editor/collaborations/:id/members
- Add member ke collaboration

DELETE /api/editor/collaborations/:id/members/:userId
- Remove member dari collaboration
```

---

## 🎨 UI/UX Improvements

### Typography Improvements
- Better heading hierarchy (h1-h6)
- Improved font weights and line-height
- Consistent letter-spacing

### Spacing System
- CSS variables untuk consistent spacing
- Margin/padding utilities (mb-*, mt-*, p-*, py-*, px-*)
- Standardized gaps between elements

### Color System
- Consistent color scheme dengan CSS variables
- Primary, Secondary, Success, Danger, Warning, Info colors
- Better contrast for accessibility

### Responsive Design
- Mobile-first approach
- Breakpoints: 576px, 768px, 1200px
- Grid-based layout system
- Flexible components

### Component Improvements
- Cards dengan shadow dan hover effects
- Buttons dengan better spacing dan transitions
- Forms dengan improved focus states
- Badges dengan better styling
- Alerts dengan left border dan colors

### Utilities
- Flexbox utilities (d-flex, justify-content-*, align-items-*)
- Spacing utilities
- Text utilities (text-center, text-muted, etc.)
- Display utilities

---

## 🔐 Authentication & Authorization

### Middleware

**verifyToken** - Check valid JWT token
```javascript
const token = req.headers.authorization?.split(' ')[1];
// Verify with JWT
```

**authorize** - Check user role
```javascript
authorize('editor')  // Only editor can access
authorize('admin', 'editor')  // Admin atau editor
```

### Usage in Routes
```javascript
router.use(verifyToken);  // Require login
router.use(authorize('editor'));  // Require editor role
```

---

## 📦 Database Schema Updates

### New Tables

#### `journal_reviews`
- ID_review (PK)
- ID_jurnal (FK to jurnal)
- FK_ID_editor (FK to users)
- FK_ID_author (FK to users)
- status (pending, approved, revision, rejected)
- feedback (longtext)
- revision_notes (longtext)
- created_at, updated_at (timestamp)

#### `journal_versions`
- ID_version (PK)
- ID_jurnal (FK to jurnal)
- FK_ID_user (FK to users)
- version_number (int)
- file (text - filename)
- description (text)
- created_at (timestamp)

#### `collaborations`
- ID_collab (PK)
- title (varchar)
- description (text)
- document_file (text - filename)
- owner_id (FK to users)
- status (active, archived)
- visibility (private, public)
- created_at, updated_at (timestamp)

#### `collaboration_members`
- ID_member (PK)
- ID_collab (FK to collaborations)
- FK_ID_user (FK to users)
- role (owner, editor, viewer)
- added_at (timestamp)
- UNIQUE(ID_collab, FK_ID_user)

### Modified Tables

#### `jurnal`
- Add: status (varchar) - default 'draft'
- Add: revision_count (int) - default 0

---

## 🚀 Setup & Installation

### 1. Database Migration

```bash
mysql -u root -p sustainovata-db < db/migration_new_features.sql
```

### 2. Backend Setup

```bash
cd backend-js
npm install
npm run dev  # Development with nodemon
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Development server
```

### 4. Environment Variables (.env)

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=sustainovata-db
JWT_SECRET=S3c73tK3y
JWT_EXPIRES_IN=1h
```

---

## 📁 New File Structure

### Backend
```
backend-js/
├── src/
│   ├── controllers/
│   │   ├── editor/
│   │   │   ├── journalReviewController.js
│   │   │   └── collaborationController.js
│   │   └── client/
│   │       └── authorJournalController.js
│   ├── middlewares/
│   │   └── authorization.js (NEW)
│   └── routes/
│       ├── editorRoutes.js (NEW)
│       └── authorRoutes.js (NEW)
```

### Frontend
```
frontend/src/
├── page/
│   ├── editor/
│   │   ├── dashboard.vue
│   │   ├── journalReview.vue
│   │   └── collaborations.vue
│   └── author/
│       ├── myJournals.vue
│       └── journalForm.vue
└── style.css (UPDATED - with new utilities)
```

---

## 🧪 Testing the Features

### 1. Test Editor Role

1. Register/login sebagai user dengan role `editor`
2. Access `/editor/dashboard`
3. Should see pending journals statistics
4. Click journal untuk review
5. Provide feedback dan submit review

### 2. Test Author Role

1. Register/login sebagai user dengan role `author`
2. Go to `/author/journals`
3. Click "Create Journal"
4. Fill form dan submit
5. Journal akan appear di editor's pending list

### 3. Test Collaboration

1. Login sebagai editor
2. Go to `/editor/collaborations`
3. Create collaboration dengan upload file
4. Add members
5. Members bisa access kolaborasi

### 4. Test Admin Restriction

1. Login sebagai admin
2. Try to access `/editor/dashboard` - should be denied
3. Should only have access ke berita dan program management

---

## 🐛 Common Issues & Solutions

### Issue: "Access denied" error
**Solution:** Check user role di database. Verify JWT token di headers.

### Issue: File upload not working
**Solution:** Check folder permissions di `backend-js/src/fileSaved/`. Ensure folder exists.

### Issue: Database connection error
**Solution:** Verify database credentials di `.env` file. Ensure MySQL service running.

### Issue: CORS error
**Solution:** Frontend URL harus match dengan corsOptions di `backend-js/src/middlewares/middleWareCors.js`

---

## 📝 API Documentation

### Authentication Header
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Response Format
```json
{
  "data": {...},
  "message": "Success",
  "error": null
}
```

### Error Handling
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🔄 Future Enhancements

1. Real-time collaboration (WebSocket)
2. Advanced journal search & filtering
3. Publication metrics & analytics
4. Email notifications untuk reviews
5. Journal versioning & comparison
6. Advanced commenting system
7. Export to PDF/Word capabilities
8. Integration dengan external databases (Scopus, PubMed)

---

## 📞 Support

Untuk pertanyaan atau issues, silakan buat issue di repository atau hubungi tim development.

