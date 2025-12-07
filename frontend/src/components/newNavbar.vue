<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="@logo" alt="Logo" height="50">
      </a>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarContent" 
        aria-controls="navbarContent" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto mb-0 mb-lg-0">
          <li v-for="(item, index) in mainNavItems" :key="index" class="nav-item">
            <router-link class="nav-link" :to="item.path" active-class="active">
              {{ item.name }}
            </router-link>
          </li>
          
          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="moreDropdown" 
              role="button" 
              @click.prevent="toggleDropdown"
              :aria-expanded="dropdownOpen"
            >
              Lainnya
            </a>
            <ul 
              class="dropdown-menu" 
              :class="{ show: dropdownOpen }"
              aria-labelledby="moreDropdown"
            >
              <li v-for="(item, index) in dropdownItems" :key="index">
                <router-link 
                  class="dropdown-item" 
                  :to="item.path"
                  @click="closeDropdown"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>
          </li>
          
          <li class="nav-item ms-2 position-relative">
            <PopupOverlay 
              :is-logged-in="isLoggedIn" 
              :user="user"
              @login="handleLogin"
              @register="handleRegister"
              @logout="handleLogout"
              @dashboard="handleDashboard"
            />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import PopupOverlay from './PopupOverlay.vue';
import { getToken, getUser, logout } from '../utils/auth';
import axios from 'axios';

const router = useRouter();
const isLoggedIn = ref(false);
const user = ref({});
const dropdownOpen = ref(false);

// Main navigation items (yang paling penting)
const mainNavItems = [
  { name: 'Beranda', path: '/' },
  { name: 'Tentang Kami', path: '/about' },
  { name: 'Program & Inovasi', path: '/programs' },
  { name: 'Berita', path: '/news' }
];

// Items untuk dropdown "Lainnya"
const dropdownItems = [
  { name: 'Publikasi Ilmiah', path: '/publications' },
  { name: 'Pusat Riset', path: '/research' },
  { name: 'Kemitraan', path: '/kemitraan' },
  { name: 'Kontak', path: '/contact' }
];

onMounted(() => {
  const token = getToken();
  const userData = getUser();

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    isLoggedIn.value = true;
    // console.log('Token found:', token);
    // console.log('User found:', userData);
    user.value = userData;
  } else {
    console.log('No token found');
  }

  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Methods
const handleLogin = () => {
  router.push('/login');
//   console.log('Login clicked');
};

const handleRegister = () => {
  router.push('/register');
//   console.log('Register clicked');
};

const handleLogout = () => {
//   console.log('Logout clicked');
  logout();
  isLoggedIn.value = false;
  user.value = {};
};

const handleDashboard = () => {
  if (user.value.role === 'admin'|| user.value.role === 'dev') {
    router.push('/admin/dashboard');
  } else {
    alert('Anda bukan admin mapun developer');
  }
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  const dropdown = document.getElementById('moreDropdown');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  
  if (dropdown && dropdownMenu && dropdownOpen.value) {
    if (!dropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownOpen.value = false;
    }
  }
};
</script>

<style scoped>
.navbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.navbar-nav .nav-link {
  color: #000;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.navbar-nav .nav-link:hover,
.dropdown-item:hover {
  color: #4CAF50;
}

.navbar-nav .nav-link.active {
  color: #4CAF50;
  font-weight: 600;
}

.dropdown-menu {
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  padding: 0.5rem 0;
  margin-top: 0.125rem;
  background-color: #fff;
  z-index: 1000;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  color: #000;
  font-weight: 500;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #4CAF50;
}

/* For proper spacing between nav items */
@media (min-width: 992px) {
  .navbar-nav .nav-item {
    margin: 0 0.25rem;
  }
}

/* Improved mobile menu */
@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 1rem 0;
  }
  
  .navbar-nav .nav-item {
    width: 100%;
    text-align: center;
    padding: 0.5rem 0;
  }
  
  .dropdown-menu {
    position: static !important;
    transform: none !important;
    border: none;
    box-shadow: none;
    background-color: #f8f9fa;
    margin-top: 0.5rem;
    display: none;
    width: 100%;
  }
  
  .dropdown-menu.show {
    display: block;
  }
  
  .dropdown-item {
    text-align: center;
  }
}
</style>