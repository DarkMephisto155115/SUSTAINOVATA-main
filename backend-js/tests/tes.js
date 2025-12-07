const express = require('express');
const app = express();
const port = 3000;

// Cek koneksi ke database
const db = require('./tes-db'); // Import koneksi

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server berjalan dan koneksi database dicek di console.');
});

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
