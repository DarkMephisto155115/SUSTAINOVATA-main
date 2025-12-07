<template>
  <div class="auth-page register-bg">
    <div class="auth-container">
      <h1 class="auth-title">DAFTAR</h1>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <!-- Name Field -->
        <div class="form-group" :class="{ 'has-error': errors.name }">
          <label for="name">Nama Lengkap</label>
          <div class="input-wrapper">
            <i class="bi bi-person input-icon"></i>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              required
              class="form-control"
              placeholder="Masukkan nama lengkap"
              @blur="validateField('name')"
            >
          </div>
          <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
        </div>
        
        <!-- Email Field -->
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <i class="bi bi-envelope input-icon"></i>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              class="form-control"
              placeholder="Masukkan email"
              @blur="validateField('email')"
            >
          </div>
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>
        
        <!-- Telephone Field -->
        <div class="form-group" :class="{ 'has-error': errors.telephone }">
          <label for="telephone">Nomor Telepon</label>
          <div class="input-wrapper">
            <i class="bi bi-telephone input-icon"></i>
            <input 
              type="tel" 
              id="telephone" 
              v-model="telephone" 
              required
              class="form-control"
              placeholder="Masukkan nomor telepon"
              @blur="validateField('telephone')"
            >
          </div>
          <p v-if="errors.telephone" class="error-message">{{ errors.telephone }}</p>
        </div>
        
        <!-- Address Field -->
        <div class="form-group" :class="{ 'has-error': errors.address }">
          <label for="address">Alamat</label>
          <div class="input-wrapper">
            <i class="bi bi-geo-alt input-icon"></i>
            <textarea 
              id="address" 
              v-model="address" 
              required
              class="form-control textarea"
              placeholder="Masukkan alamat lengkap"
              rows="3"
              @blur="validateField('address')"
            ></textarea>
          </div>
          <p v-if="errors.address" class="error-message">{{ errors.address }}</p>
        </div>
        
        <!-- Password Field -->
        <div class="form-group" :class="{ 'has-error': errors.password }">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="bi bi-lock input-icon"></i>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required
              class="form-control"
              placeholder="Masukkan password"
              @blur="validateField('password')"
            >
          </div>
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>
        
        <!-- Confirm Password Field -->
        <div class="form-group" :class="{ 'has-error': errors.confirmPassword }">
          <label for="confirmPassword">Konfirmasi Password</label>
          <div class="input-wrapper">
            <i class="bi bi-lock-fill input-icon"></i>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required
              class="form-control"
              placeholder="Konfirmasi password"
              @blur="validateField('confirmPassword')"
            >
          </div>
          <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
        </div>
        
        <!-- Submit Button -->
        <button 
          type="submit" 
          class="btn-auth" 
          :disabled="isLoading || hasErrors"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Memproses...' : 'Daftar' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Sudah punya akun? <router-link to="/login">Masuk</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// Form fields
const name = ref('');
const email = ref('');
const telephone = ref('');
const address = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('user');
const isLoading = ref(false);

// Form validation
const errors = ref({
  name: '',
  email: '',
  telephone: '',
  address: '',
  password: '',
  confirmPassword: ''
  // role: 'user'
});

// Check if there are any errors
const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '');
});

// Validate individual fields
const validateField = (field) => {
  switch (field) {
    case 'name':
      if (!name.value) {
        errors.value.name = 'Nama tidak boleh kosong';
      } else if (name.value.length < 3) {
        errors.value.name = 'Nama minimal 3 karakter';
      } else {
        errors.value.name = '';
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value) {
        errors.value.email = 'Email tidak boleh kosong';
      } else if (!emailRegex.test(email.value)) {
        errors.value.email = 'Format email tidak valid';
      } else {
        errors.value.email = '';
      }
      break;
      
    case 'telephone':
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!telephone.value) {
        errors.value.telephone = 'Nomor telepon tidak boleh kosong';
      } else if (!phoneRegex.test(telephone.value.replace(/\D/g, ''))) {
        errors.value.telephone = 'Nomor telepon tidak valid (10-15 digit)';
      } else {
        errors.value.telephone = '';
      }
      break;
      
    case 'address':
      if (!address.value) {
        errors.value.address = 'Alamat tidak boleh kosong';
      } else if (address.value.length < 10) {
        errors.value.address = 'Alamat terlalu pendek, minimal 10 karakter';
      } else {
        errors.value.address = '';
      }
      break;
      
    case 'password':
      if (!password.value) {
        errors.value.password = 'Password tidak boleh kosong';
      } else if (password.value.length < 6) {
        errors.value.password = 'Password minimal 6 karakter';
      } else {
        errors.value.password = '';
      }
      break;
      
    case 'confirmPassword':
      if (!confirmPassword.value) {
        errors.value.confirmPassword = 'Konfirmasi password tidak boleh kosong';
      } else if (confirmPassword.value !== password.value) {
        errors.value.confirmPassword = 'Password tidak cocok';
      } else {
        errors.value.confirmPassword = '';
      }
      break;
  }
};

// Validate all fields
const validateForm = () => {
  validateField('name');
  validateField('email');
  validateField('telephone');
  validateField('address');
  validateField('password');
  validateField('confirmPassword');
  
  return !hasErrors.value;
};

const handleRegister = async () => {
  
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;

  try {
    axios.post('http://localhost:3000/api/clients/register', {
      name: name.value,
      email: email.value,
      telephone: telephone.value,
      address: address.value,
      password: password.value,
    })
    .then((response) => {
      console.log(response.data);
      alert('Pendaftaran berhasil! Silakan login dengan akun baru Anda.');
      router.push('/login');
    })
  }catch (error) {
    console.error('Registration error:', error);
    alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
  } finally {
    isLoading.value = false;
  }
  
  // try {
  //   await new Promise(resolve => setTimeout(resolve, 1500));
    
  //   console.log('Registration data:', {
  //     name: name.value,
  //     email: email.value,
  //     telephone: telephone.value,
  //     address: address.value,
  //     password: password.value
  //   });
    
  //   // Show success message
  //   alert('Pendaftaran berhasil! Silakan login dengan akun baru Anda.');
    
  //   // Redirect to login page
  //   router.push('/login');
  // } catch (error) {
  //   console.error('Registration error:', error);
  //   alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
  // } finally {
  //   isLoading.value = false;
  // }
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

.register-bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../../assets/background/bg-register.png');
}

.auth-container {
  width: 100%;
  max-width: 500px;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
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

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 10px;
  top: 14px;
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

.textarea {
  padding-top: 12px;
  padding-left: 40px;
  resize: vertical;
  min-height: 80px;
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
  margin-top: 10px;
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
}

.auth-footer a {
  color: #5a8f00;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}

.me-2 {
  margin-right: 0.5rem;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .auth-container {
    padding: 30px 20px;
  }
  
  .auth-title {
    font-size: 2rem;
  }
}
</style>