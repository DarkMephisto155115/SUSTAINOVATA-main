<template>
  <div class="auth-page forgot-password-bg">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Lupa Password</h1>
        <p class="auth-subtitle">Masukkan email Anda untuk menerima link reset password</p>
      </div>
      
      <div v-if="resetStatus === 'success'" class="success-message">
        <div class="success-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h2>Email Terkirim!</h2>
        <p>Link reset password telah dikirim ke <strong>{{ email }}</strong>. Silakan periksa kotak masuk Anda.</p>
        <p class="small-text">Tidak menerima email? Periksa folder spam atau <button @click="resetForm" class="text-button">coba lagi</button>.</p>
        <router-link to="/login" class="btn-auth mt-4">Kembali ke Login</router-link>
      </div>
      
      <form v-else @submit.prevent="handleResetRequest" class="auth-form">
        <div class="form-group" :class="{ 'has-error': emailError }">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <i class="bi bi-envelope input-icon"></i>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              class="form-control"
              placeholder="Masukkan email Anda"
              @input="validateEmail"
            >
          </div>
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>
        
        <button 
          type="submit" 
          class="btn-auth" 
          :disabled="isLoading || !!emailError || !email"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Mengirim...' : 'Kirim Link Reset' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Ingat password Anda? <router-link to="/login">Masuk</router-link></p>
        <p>Belum punya akun? <router-link to="/register">Daftar</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const emailError = ref('');
const isLoading = ref(false);
const resetStatus = ref('idle'); // 'idle', 'loading', 'success', 'error'

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.value) {
    emailError.value = 'Email tidak boleh kosong';
    return false;
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Format email tidak valid';
    return false;
  } else {
    emailError.value = '';
    return true;
  }
};

const handleResetRequest = async () => {
  if (!validateEmail()) return;
  
  isLoading.value = true;
  resetStatus.value = 'loading';
  
  try {
    // Here you would typically call your password reset API
    // For demo purposes, we'll simulate an API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Password reset requested for:', email.value);
    resetStatus.value = 'success';
  } catch (error) {
    console.error('Error requesting password reset:', error);
    resetStatus.value = 'error';
    alert('Terjadi kesalahan. Silakan coba lagi.');
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  email.value = '';
  emailError.value = '';
  resetStatus.value = 'idle';
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
  background-attachment: fixed;
}

.forgot-password-bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/background/bg-forgot.jpg');
}

.auth-container {
  width: 100%;
  max-width: 450px;
  background-color: rgba(255, 255, 255, 0.288);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
}

.auth-subtitle {
  color: #ffffff;
  font-size: 1rem;
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

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
}

.form-control {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f8f8;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #5a8f00;
  box-shadow: 0 0 0 3px rgba(90, 143, 0, 0.1);
}

.has-error .form-control {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
}

.btn-auth {
  background-color: #5a8f00;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-auth:hover:not(:disabled) {
  background-color: #4a7800;
}

.btn-auth:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-footer a {
  color: #5a8f00;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* Success message styles */
.success-message {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 4rem;
  color: #5a8f00;
  margin-bottom: 20px;
}

.success-message h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #333;
}

.success-message p {
  color: #555;
  margin-bottom: 15px;
}

.small-text {
  font-size: 0.85rem;
  color: #777;
}

.text-button {
  background: none;
  border: none;
  color: #5a8f00;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.text-button:hover {
  text-decoration: underline;
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>