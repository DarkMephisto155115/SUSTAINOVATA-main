const express = require('express');
const app = express();
const port = 3000;
const db = require('./tes-db'); // Pastikan ini mengarah ke file koneksi database Anda
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());

// Data tes
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  telephone: "08123456789",
  address: "Jl. Test No. 123"
};

// 1. Tes Fungsi Hash Password
async function testHashPassword() {
  try {
    console.log("=== TEST HASH PASSWORD ===");
    const hash = await bcrypt.hash(testUser.password, 10);
    console.log("Password asli:", testUser.password);
    console.log("Password terhash:", hash);
    console.log("Panjang hash:", hash.length, "karakter");
    
    const isMatch = await bcrypt.compare(testUser.password, hash);
    console.log("Verifikasi sukses?", isMatch);
    
    return hash;
  } catch (error) {
    console.error("Error dalam testHashPassword:", error);
  }
}

// 2. Tes Registrasi User
async function testRegister() {
  try {
    console.log("\n=== TEST REGISTRASI ===");
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    
    const [result] = await db.promise().query(
      'INSERT INTO users SET ?', 
      {
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        telephone: testUser.telephone,
        address: testUser.address
      }
    );
    
    console.log("User terdaftar dengan ID:", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error("Error dalam testRegister:", error);
    // Jika user sudah ada, hapus dulu
    if (error.code === 'ER_DUP_ENTRY') {
      await db.promise().query('DELETE FROM users WHERE email = ?', [testUser.email]);
      return testRegister(); // Coba lagi
    }
    throw error;
  }
}

// 3. Tes Login dan JWT
async function testLogin() {
  try {
    console.log("\n=== TEST LOGIN ===");
    
    // Cari user di database
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?', 
      [testUser.email]
    );
    
    if (users.length === 0) {
      throw new Error("User tidak ditemukan");
    }
    
    const user = users[0];
    
    // Verifikasi password
    const isMatch = await bcrypt.compare(testUser.password, user.password);
    console.log("Password match?", isMatch);
    
    if (!isMatch) {
      console.log("Password dari DB:", user.password);
      console.log("Panjang hash:", user.password.length);
      throw new Error("Password tidak cocok");
    }
    
    // Buat JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'rahasia_test',
      { expiresIn: '1h' }
    );
    
    console.log("Token JWT:", token);
    return token;
  } catch (error) {
    console.error("Error dalam testLogin:", error);
    throw error;
  }
}

// 4. Tes Verifikasi Token
function testVerifyToken(token) {
  try {
    console.log("\n=== TEST VERIFIKASI TOKEN ===");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_test');
    console.log("Token decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error dalam testVerifyToken:", error);
    throw error;
  }
}

// Jalankan semua tes
async function runAllTests() {
  try {
    // Tes 1: Hash password
    await testHashPassword();
    
    // Tes 2: Registrasi
    const userId = await testRegister();
    
    // Tes 3: Login
    const token = await testLogin();
    
    // Tes 4: Verifikasi token
    await testVerifyToken(token);
    
    console.log("\n=== SEMUA TEST BERHASIL ===");
  } catch (error) {
    console.error("\n=== TEST GAGAL ===", error);
  } finally {
    // Bersihkan data tes
    await db.promise().query('DELETE FROM users WHERE email = ?', [testUser.email]);
    process.exit();
  }
}

// Jalankan tes
runAllTests();

// Server Express untuk endpoint tes
app.post('/test/register', async (req, res) => {
  try {
    const userId = await testRegister();
    res.json({ success: true, userId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/test/login', async (req, res) => {
  try {
    const token = await testLogin();
    res.json({ success: true, token });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server tes berjalan di http://localhost:${port}`);
});