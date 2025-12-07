const express = require('express');
const cors = require('cors');

const app = express();

// Konfigurasi CORS
const corsOptions = {
  origin: 'http://localhost:5173', // Izinkan hanya dari origin ini
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Jika menggunakan cookies/auth
};

app.use(cors(corsOptions));

// Atau untuk izinkan semua origin (development saja)
// app.use(cors());