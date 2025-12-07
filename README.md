# SUSTAINOVATA Platform

**Sistem Manajemen Jurnal dan Kolaborasi Penelitian Berkelanjutan**

Platform terpadu untuk memfasilitasi penelitian, publikasi, dan kolaborasi dalam bidang pembangunan berkelanjutan.

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)
- [Peran Pengguna](#peran-pengguna)
- [Database](#database)
- [Dokumentasi Lebih Lanjut](#dokumentasi-lebih-lanjut)

---

## ✨ Fitur Utama

### 📚 Manajemen Jurnal (6 fitur)
- **Submit Jurnal**: Author dapat mensubmit jurnal dengan dokumen lampiran
- **Review Jurnal**: Editor dapat mereview jurnal dan memberikan keputusan
- **Status Tracking**: Lacak status jurnal (pending_review, published, revision_needed, rejected)
- **Revision Workflow**: Author dapat merevisi dan resubmit jurnal berdasarkan feedback
- **Publication**: Publikasi jurnal yang disetujui dan tampilkan di halaman publikasi
- **Search & Filter**: Pencarian dan filter jurnal berdasarkan berbagai kriteria

### 🤝 Kolaborasi (5 fitur)
- **Permintaan Kolaborasi**: User dapat mengajukan permintaan kolaborasi melalui halaman Kemitraan
- **Collaboration Pool**: Kolaborasi request disimpan di pool umum yang dapat dilihat semua editor
- **Accept/Reject**: Editor dapat menerima atau menolak permintaan kolaborasi
- **Contact Information**: Simpan informasi kontak organisasi dan perwakilan
- **Status Management**: Kelola status permintaan kolaborasi (pending, accepted, rejected)

### 💬 Manajemen Pesan (4 fitur)
- **Message System**: Sistem pesan terpadu untuk komunikasi stakeholder
- **Message Categories**: Kategorisasi pesan berdasarkan topik
- **Status Tracking**: Lacak status pesan (new, read, resolved)
- **Admin Dashboard**: Dashboard admin untuk melihat dan mengelola semua pesan

### 👤 Manajemen Pengguna (2 fitur)
- **Role-Based Access**: Kontrol akses berbasis peran (admin, editor, author, user)
- **User Profile**: Profil pengguna dengan informasi dan pengaturan

### 📊 Dashboard (6 fitur)
- **Admin Dashboard**: Statistik platform, manajemen konten, pesan
- **Editor Dashboard**: Statistik review, jurnal pending, pesan
- **Author Dashboard**: Jurnal saya, draft, status submission
- **Quick Statistics**: Ringkasan cepat metrik penting
- **Recent Activity**: Aktivitas terbaru di platform
- **Analytics**: Analisis data penggunaan platform

### 📰 Manajemen Konten (5 fitur)
- **News Management**: Kelola berita dan pengumuman platform
- **Programs Management**: Kelola program dan inisiatif penelitian
- **Publications Display**: Tampilkan publikasi dan jurnal terbit
- **Research Centers**: Informasi pusat penelitian
- **Resource Library**: Perpustakaan sumber daya dan referensi

---

## 🛠 Teknologi

### Frontend
- **Vue.js 3** - Framework JavaScript progressive
- **Vite** - Build tool modern dan cepat
- **Bootstrap 5** - CSS framework responsif
- **Axios** - HTTP client untuk API calls
- **Vue Router** - Routing untuk SPA
- **Moment.js** - Manipulasi tanggal dan waktu

### Backend
- **Node.js & Express.js** - JavaScript runtime dan web framework
- **MySQL** - Database relasional
- **JWT** - Autentikasi dan otorisasi
- **Bcrypt** - Password hashing dan keamanan
- **Multer** - File upload handling
- **Nodemon** - Development server auto-reload
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL 8.0+** - Relasional database dengan 12+ tables
- **Normalized Schema** - Database schema yang terstruktur baik
- **Foreign Keys** - Integritas referensial

---

## 📦 Prasyarat

Pastikan sistem Anda memiliki:

- **Node.js** (v14.0.0 atau lebih tinggi) - [Download](https://nodejs.org/)
- **npm** (v6.0.0 atau lebih tinggi) - Biasanya included dengan Node.js
- **MySQL** (v5.7 atau lebih tinggi) - [Download](https://www.mysql.com/)
- **Git** - Untuk version control

### Verifikasi Instalasi

```bash
node --version    # v14.0.0 atau lebih tinggi
npm --version     # v6.0.0 atau lebih tinggi
mysql --version   # v5.7 atau lebih tinggi
```

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/sustainovata.git
cd SUSTAINOVATA-main
```

### 2. Setup Database

```bash
# Login ke MySQL
mysql -u root -p

# Di MySQL console, jalankan:
source db/sustainovata_db.sql
```

Atau jika menggunakan GUI tool seperti MySQL Workbench:
1. Buka MySQL Workbench
2. File → Open SQL Script → Pilih `db/sustainovata_db.sql`
3. Execute (Ctrl+Shift+Enter)

### 3. Setup Backend

```bash
cd backend-js

# Install dependencies
npm install

# Copy .env dan konfigurasi (lihat section Konfigurasi)
cp .env .env.local  # Sesuaikan konfigurasi

# Jalankan migration tambahan jika diperlukan
mysql -u root -p sustainovata_db < ../db/migration_*.sql
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install
```

---

## ⚙️ Konfigurasi

### Backend Configuration (`.env`)

Buat file `.env` di direktori `backend-js/`:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=sustainovata_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=S3c73tK3y
JWT_EXPIRES_IN=1h
```

**Catatan Keamanan:**
- Ubah `JWT_SECRET` dengan value yang aman di production
- Jangan commit `.env` ke repository (sudah di `.gitignore`)
- Gunakan password MySQL yang kuat

### Frontend Configuration

Frontend berkomunikasi dengan backend melalui:
- Default API URL: `http://localhost:3000/api`
- Lokasi konfigurasi: `frontend/src/`

Jika backend berjalan di URL berbeda, update konfigurasi di file yang menggunakan axios calls.

---

## 🎯 Menjalankan Aplikasi

### Development Mode

**Terminal 1 - Backend Server**

```bash
cd backend-js
npm run dev
```

Output expected:
```
Server running on port 3000
```

**Terminal 2 - Frontend Development Server**

```bash
cd frontend
npm run dev
```

Output expected:
```
  ➜  Local:   http://localhost:5173/
```

**Akses Aplikasi**

1. Buka browser ke `http://localhost:5173`
2. Lakukan registrasi atau login dengan kredensial yang ada
3. Explore fitur sesuai peran pengguna

### Production Build

**Frontend Build**

```bash
cd frontend

# Build untuk production
npm run build

# Preview hasil build (optional)
npm run preview
```

Output:
- `dist/` - Folder hasil build yang siap deploy
- Size: ~557KB JS + 371KB CSS

**Backend Production**

```bash
cd backend-js

# Jalankan dengan production manager seperti PM2
npm install -g pm2
pm2 start index.js --name "sustainovata-backend"
```

---

## 📁 Struktur Proyek

```
SUSTAINOVATA/
├── backend-js/                 # Express.js Backend
│   ├── src/
│   │   ├── config/            # Konfigurasi
│   │   ├── controllers/       # Business logic
│   │   │   ├── admin/
│   │   │   ├── editor/
│   │   │   ├── author/
│   │   │   └── client/
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Express middleware
│   │   ├── database/          # Database utilities
│   │   └── app.js            # Express app setup
│   ├── uploads/               # File uploads storage
│   ├── tests/                 # Test files
│   ├── index.js              # Entry point
│   ├── package.json
│   └── .env                  # Environment variables
│
├── frontend/                  # Vue.js 3 Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── page/            # Page components
│   │   │   ├── editor/
│   │   │   ├── author/
│   │   │   ├── admin/
│   │   │   └── public pages
│   │   ├── router/          # Vue Router config
│   │   ├── stores/          # State management (jika ada)
│   │   ├── assets/          # Static assets
│   │   └── App.vue          # Root component
│   ├── public/              # Static files
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── db/                       # Database files
│   ├── sustainovata_db.sql  # Main schema
│   ├── migration_*.sql      # Database migrations
│   └── schema/              # Schema documentation
│
├── .gitignore               # Git ignore rules
├── README.md               # Dokumentasi ini
└── LAPORAN.md              # Dokumentasi sistem lengkap
```

---

## 🔌 API Endpoints

Platform menyediakan **45+ API endpoints** yang terbagi dalam beberapa kategori:

### Authentication (2 endpoints)
```
POST   /api/clients/register              # Registrasi pengguna baru
POST   /api/clients/login                # Login pengguna
```

### Journal Management (6 endpoints)
```
GET    /api/editor/journals              # Semua jurnal (semua status)
GET    /api/editor/journals/pending      # Jurnal pending review
GET    /api/editor/journals/:id          # Detail jurnal
POST   /api/editor/journals/:id/review   # Submit review jurnal
PUT    /api/editor/reviews/:id           # Update review
GET    /api/author/journals              # Jurnal milik author
```

### Collaboration (6 endpoints)
```
GET    /api/editor/collaboration-requests     # Semua permintaan kolaborasi
GET    /api/editor/collaboration-requests/:id # Detail permintaan
POST   /api/clients/collaboration-request     # Submit kolaborasi baru
PUT    /api/editor/collaboration-requests/:id/accept  # Terima permintaan
PUT    /api/editor/collaboration-requests/:id/reject  # Tolak permintaan
GET    /api/users/editors                     # Daftar editor aktif
```

### Message Management (4 endpoints)
```
POST   /api/clients/contact              # Kirim pesan kontak
GET    /api/admin/messages               # Lihat semua pesan
PUT    /api/admin/messages/:id/status    # Update status pesan
DELETE /api/admin/messages/:id           # Hapus pesan
```

### Content Management (15+ endpoints)
```
GET    /api/clients/news                 # Lihat berita
GET    /api/clients/programs             # Lihat program
GET    /api/clients/publications         # Lihat publikasi
GET    /api/clients/research-centers     # Lihat pusat penelitian
... (dan endpoints admin untuk CRUD operations)
```

Untuk dokumentasi API lengkap, lihat `LAPORAN.md` Bab 3.4.

---

## 👥 Peran Pengguna

Platform mendukung 4 peran utama dengan akses dan fitur berbeda:

### 1. **Admin**
- Manajemen konten (berita, program, publikasi)
- Dashboard statistik platform
- Manajemen pesan kontak
- User management

**Akses Routes:**
- `/admin/dashboard` - Admin dashboard
- `/admin/messages` - Manajemen pesan
- `/admin/content` - Manajemen konten

### 2. **Editor**
- Review jurnal submission
- Accept/reject jurnal dengan feedback
- Kelola collaboration requests
- Dashboard statistik review

**Akses Routes:**
- `/editor/dashboard` - Editor dashboard
- `/editor/journals` - Daftar jurnal untuk review
- `/editor/collaborations` - Kelola kolaborasi

### 3. **Author**
- Submit jurnal
- View status jurnal
- Resubmit dengan revisi
- Akses revisi dan feedback

**Akses Routes:**
- `/author/journals` - Daftar jurnal saya
- `/author/journals/create` - Submit jurnal baru
- `/author/journals/:id` - Detail jurnal

### 4. **User/Guest**
- Akses halaman publik
- Lihat publikasi dan berita
- Ajukan kolaborasi
- Hubungi melalui formulir kontak

**Akses Routes:**
- `/` - Home page
- `/publikasi` - Daftar publikasi
- `/kemitraan` - Ajukan kolaborasi
- `/hubungi` - Form kontak

---

## 🗄️ Database

### Schema Overview

Platform menggunakan **12+ tabel** dengan struktur terstruktur:

**Tabel Utama:**
- `users` - Data pengguna dan autentikasi
- `jurnal` - Jurnal submission
- `journal_reviews` - Review jurnal
- `collaboration_requests` - Permintaan kolaborasi
- `contact_messages` - Pesan kontak
- `news` - Berita platform
- `programs` - Program penelitian
- `research_centers` - Pusat penelitian
- `resources` - Sumber daya/referensi
- `admin_files` - File admin
- `journal_revisions` - Revisi jurnal
- `message_attachments` - Lampiran pesan

### Optimasi Database

- **25+ Indexes** - Untuk performa query cepat
- **Foreign Keys** - Integritas referensial terjaga
- **Normalized Schema** - Struktur optimal dengan minimal redundansi
- **Query Performance** - Rata-rata 50-150ms per query

Lihat `db/sustainovata_db.sql` untuk schema lengkap.

---

## 📖 Dokumentasi Lebih Lanjut

### Dokumentasi Teknis Lengkap

Baca `LAPORAN.md` untuk dokumentasi komprehensif yang mencakup:

- **Bab 1**: Pendahuluan dan latar belakang
- **Bab 2**: Analisis masalah dan komponen sistem
- **Bab 3**: Metrik performa dan fitur implementasi
- **Bab 4**: Rancangan dan business process
- **Bab 5**: Prototype dan mockup UI
- **Bab 6**: Evaluasi dan roadmap pengembangan

```bash
# Buka dokumentasi
cat LAPORAN.md
```

---

## 🐛 Troubleshooting

### Backend tidak terhubung ke database

```bash
# Verifikasi MySQL berjalan
mysql -u root -p -e "SELECT VERSION();"

# Cek konfigurasi .env
cat backend-js/.env

# Verifikasi database ada
mysql -u root -p -e "SHOW DATABASES;" | grep sustainovata_db
```

### Frontend tidak terhubung ke backend

```bash
# Pastikan backend berjalan di port 3000
curl http://localhost:3000

# Cek CORS configuration di backend
# Edit backend-js/src/app.js jika diperlukan
```

### Port sudah digunakan

```bash
# Windows - Cari process pada port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Atau gunakan port berbeda
PORT=3001 npm run dev
```

### Build frontend error

```bash
# Clear cache dan reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📝 Catatan Pengembangan

### Menjalankan Tests

```bash
# Backend tests (jika ada)
cd backend-js
npm run test-db        # Test database connection
npm run test-auth      # Test authentication
npm run test-up        # Test file upload
```

### Lint dan Format

```bash
# Jika project menggunakan linter/formatter
npm run lint
npm run format
```

### Build Frontend untuk Deployment

```bash
cd frontend
npm run build

# Output akan di folder 'dist/'
# Upload folder 'dist/' ke web server
```

---

## 🔐 Keamanan

### Best Practices Implemented

✅ JWT token-based authentication  
✅ Password hashing dengan bcrypt  
✅ SQL injection prevention dengan prepared statements  
✅ CORS configuration  
✅ Environment variables untuk sensitive data  
✅ Role-based access control (RBAC)  

### Rekomendasi Production

1. Ubah `JWT_SECRET` dengan value unik yang kuat
2. Gunakan HTTPS untuk semua komunikasi
3. Implement rate limiting pada API endpoints
4. Regular database backups
5. Monitor error logs dan activity logs
6. Update dependencies secara berkala

---

## 📞 Support & Kontribusi

Untuk pertanyaan, masalah, atau kontribusi:

1. **Issue Report** - Buat issue di repository
2. **Discussion** - Ajukan pertanyaan di discussion board
3. **Pull Request** - Kontribusi dengan membuat PR

---

## 📄 Lisensi

Project ini dilisensikan di bawah ISC License.

---

## 👨‍💻 Developer Information

**Project**: SUSTAINOVATA Platform  
**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready

---

## 🎯 Roadmap Masa Depan (Phase 2)

- [ ] Advanced analytics dan reporting
- [ ] Email notification system
- [ ] Mobile application
- [ ] Integration dengan external APIs
- [ ] Machine learning untuk recommendation
- [ ] Multi-language support
- [ ] Blockchain integration untuk authenticity

---

**Terima kasih telah menggunakan SUSTAINOVATA Platform!** 🚀
