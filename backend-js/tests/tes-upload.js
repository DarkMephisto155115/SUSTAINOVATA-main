const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tests/tes-upload/'); // simpan ke folder uploads
  },
  filename: function (req, file, cb) {
    // buat nama unik (timestamp + original name)
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// Middleware untuk parsing JSON
app.use(express.json());
app.use('/tes-upload', express.static(path.join(__dirname, 'tes-upload')));


// Endpoint untuk tambah anggota (contoh)
app.post('/upload', upload.single('foto'), (req, res) => {
  const { nama } = req.body;
  const fotoPath = req.file ? req.file.path : null;

  // Simpan ke DB: nama + fotoPath
  // Simulasi (log aja dulu)
  console.log('Data yang akan disimpan ke DB:', {
    nama,
    foto: fotoPath
  });

  res.json({ message: 'Data berhasil disimpan', data: { nama, foto: fotoPath } });
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
