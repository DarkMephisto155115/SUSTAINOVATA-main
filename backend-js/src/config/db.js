const mysql = require('mysql2');
const { db } = require('./env');

const database = mysql.createConnection({
  host: db.host,
  port: db.port,
  user: db.user,
  password: db.password,
  database: db.name,
});

database.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err.message);
  } else {
    console.log('✅ Berhasil terkoneksi ke database MySQL');
  }
});

module.exports = database;
