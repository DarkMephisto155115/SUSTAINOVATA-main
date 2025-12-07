<template>
  <div class="auth-page login-bg">
    <div class="auth-container">
      <h1 class="auth-title">MASUK</h1>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required class="form-control">
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required class="form-control">
        </div>

        <div class="form-options">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe">
            <label for="remember">Ingat saya</label>
          </div>
          <router-link to="/forgotPass" class="forgot-password">Lupa password?</router-link>
        </div>

        <button type="submit" class="btn-auth">Masuk</button>
      </form>

      <div class="auth-footer">
        <p>Belum punya akun? <router-link to="/register">Daftar</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getUser, logout, getToken, getRemember } from '../../utils/auth'; // sesuaikan dengan path utils auth

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);


onMounted(() => {
  const user = getUser();
  const token = getToken();
  const saved = getRemember();

  if (saved) {
    const { email: savedEmail, password: savedPassword, statusSaved = saved } = saved;
    console.log('Saved user data:', savedEmail, savedPassword, statusSaved);
    email.value = savedEmail;
    password.value = savedPassword;
    rememberMe.value = true;
  }

  if (user && token) {
    console.log('User sudah login:', user);
    router.push('/');
  } else if (user && !token) {
    console.log('User sudah login tetapi token tidak ada');
    alert('Token tidak ditemukan, silakan login kembali.');
    logout();
  } else {
    console.log('User belum login');
  }
});

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/clients/login', {
      email: email.value,
      password: password.value
    });

    const { token, user } = response.data;
    // const storage = rememberMe.value ? localStorage : sessionStorage;
    // storage.setItem('token', token);
    // storage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    if (rememberMe.value) {
      localStorage.setItem('savedUser', JSON.stringify({
        email: email.value,
        password: password.value,
        saved: true
      }));
    } else {
      localStorage.removeItem('savedUser');
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    router.push('/');

  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    alert('Login gagal: ' + msg);
  }
};
</script>


<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-size: cover;
  background-position: center;
}

.login-bg {
  background-image: url('../../assets/background/bg-login.png');
}

.auth-container {
  width: 100%;
  max-width: 450px;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(5px);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.auth-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #000;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid #333;
  background-color: transparent;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #5a8f00;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.forgot-password {
  color: #333;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-auth {
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn-auth:hover {
  background-color: #f0f0f0;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #5a8f00;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>