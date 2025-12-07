const mysql = require('mysql2');

// Buat koneksi ke MySQL (XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Kosongkan jika default
  database: 'sustainovata-db' // Ganti dengan nama database kamu
});

// Cek koneksi
db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err.message);
  } else {
    console.log('✅ Berhasil terkoneksi ke database MySQL');
  }
});

module.exports = db;
