<template>
  <div>
    <!-- Sidebar Toggle Button -->
    <button 
      class="sidebar-toggle" 
      @click="toggleSidebar"
      :class="{ 'sidebar-open': isOpen }"
    >
      <i class="bi bi-list" v-if="!isOpen"></i>
      <i class="bi bi-x-lg" v-else></i>
    </button>

    <!-- Overlay for mobile -->
    <div 
      class="sidebar-overlay" 
      :class="{ 'show': isOpen }"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'open': isOpen, 'collapsed': !isOpen }">
      <!-- Logo Section -->
      <div class="logo-container">
        <div class="logo-wrapper">
          <img src="@logo" alt="Sustainovata Logo" class="logo">
          <div class="logo-text" v-show="isOpen">
            <h5 class="mb-0 fw-bold text-primary">Sustainovata</h5>
            <small class="text-muted">Admin Panel</small>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="sidebar-menu">
        <div class="menu-section">
          <div class="menu-header" v-show="isOpen">
            <i class="bi bi-grid-3x3-gap"></i>
            <span>Menu Utama</span>
          </div>
          
          <router-link to="/admin/dashboard" class="sidebar-item" @click="closeSidebarOnMobile">
            <div class="item-content">
              <i class="bi bi-speedometer2"></i>
              <span v-show="isOpen">Dashboard</span>
            </div>
            <div class="item-indicator" v-show="isOpen"></div>
            <!-- Tooltip for collapsed state -->
            <div class="tooltip-text" v-show="!isOpen">Dashboard</div>
          </router-link>

          <router-link to="/admin/kelola/berita" class="sidebar-item" @click="closeSidebarOnMobile">
            <div class="item-content">
              <i class="bi bi-newspaper"></i>
              <span v-show="isOpen">Kelola Berita</span>
            </div>
            <div class="item-indicator" v-show="isOpen"></div>
            <div class="tooltip-text" v-show="!isOpen">Kelola Berita</div>
          </router-link>

          <router-link to="/admin/kelola/program" class="sidebar-item" @click="closeSidebarOnMobile">
            <div class="item-content">
              <i class="bi bi-calendar-event"></i>
              <span v-show="isOpen">Kelola Program</span>
            </div>
            <div class="item-indicator" v-show="isOpen"></div>
            <div class="tooltip-text" v-show="!isOpen">Kelola Program</div>
          </router-link>

          <router-link to="/admin/kelola/messages" class="sidebar-item" @click="closeSidebarOnMobile">
            <div class="item-content">
              <i class="bi bi-chat-dots"></i>
              <span v-show="isOpen">Pesan</span>
            </div>
            <div class="item-indicator" v-show="isOpen"></div>
            <div class="tooltip-text" v-show="!isOpen">Pesan</div>
          </router-link>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="sidebar-bottom">
        <!-- Back to Home Button -->
        <router-link to="/" class="home-button" @click="closeSidebarOnMobile">
          <div class="home-button-content">
            <i class="bi bi-house-door"></i>
            <div class="home-text" v-show="isOpen">
              <span class="fw-semibold">Kembali ke Website</span>
              <small class="text-muted">Lihat halaman utama</small>
            </div>
          </div>
          <i class="bi bi-arrow-right" v-show="isOpen"></i>
          <div class="tooltip-text" v-show="!isOpen">Kembali ke Website</div>
        </router-link>

        <!-- Footer -->
        <div class="sidebar-footer" v-show="isOpen">
          <div class="footer-content">
            <div class="footer-logo">
              <i class="bi bi-leaf text-success"></i>
              <span class="fw-bold">Sustainovata</span>
            </div>
            <div class="footer-text">
              <small class="text-muted">© 2025 All rights reserved</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
}

const closeSidebarOnMobile = () => {
  // Close sidebar on mobile when menu item is clicked
  if (window.innerWidth <= 768) {
    isOpen.value = false
  }
}

// Handle window resize
const handleResize = () => {
  if (window.innerWidth <= 768) {
    isOpen.value = false
  } else {
    isOpen.value = true
  }
}

onMounted(() => {
  // Set initial state based on screen size
  if (window.innerWidth <= 768) {
    isOpen.value = false
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Expose isOpen for parent components to use
defineExpose({
  isOpen
})
</script>

<style scoped>
/* Sidebar Toggle Button */
.sidebar-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.sidebar-toggle:hover {
  background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.sidebar-toggle.sidebar-open {
  left: 260px;
  background: linear-gradient(135deg, #f44336 0%, #e57373 100%);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.sidebar-toggle.sidebar-open:hover {
  background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%);
  box-shadow: 0 6px 16px rgba(244, 67, 54, 0.4);
}

/* Overlay for mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f8ffed 100%);
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar.collapsed .logo-container {
  padding: 1.5rem 1rem;
}

.sidebar.collapsed .logo-wrapper {
  justify-content: center;
}

.sidebar.collapsed .menu-section {
  padding: 0 0.5rem;
}

.sidebar.collapsed .sidebar-item {
  justify-content: center;
  padding: 0.875rem 0.5rem;
}

.sidebar.collapsed .home-button {
  justify-content: center;
  padding: 1rem 0.5rem;
}

/* Mobile styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar.collapsed {
    width: 280px;
    transform: translateX(-100%);
  }
  
  .sidebar-toggle {
    left: 20px !important;
  }
  
  .sidebar-toggle.sidebar-open {
    left: 20px !important;
  }
}

/* Logo Section */
.logo-container {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transition: padding 0.3s ease;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: justify-content 0.3s ease;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.logo-text {
  transition: opacity 0.3s ease;
}

.logo-text h5 {
  color: #2c3e50;
  font-size: 1.1rem;
  line-height: 1.2;
}

.logo-text small {
  font-size: 0.75rem;
  color: #6c757d;
}

/* Navigation Menu */
.sidebar-menu {
  flex-grow: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.menu-section {
  padding: 0 1rem;
  transition: padding 0.3s ease;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: opacity 0.3s ease;
}

.menu-header i {
  font-size: 0.875rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  margin-bottom: 0.25rem;
  color: #495057;
  text-decoration: none;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-grow: 1;
}

.item-content i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
  color: #6c757d;
  transition: color 0.3s ease;
  flex-shrink: 0;
}

.item-content span {
  font-size: 0.9rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.item-indicator {
  width: 4px;
  height: 20px;
  background: transparent;
  border-radius: 2px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

/* Tooltip for collapsed state */
.tooltip-text {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #2c3e50;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1002;
  margin-left: 10px;
}

.tooltip-text::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -5px;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-right-color: #2c3e50;
}

.sidebar.collapsed .sidebar-item:hover .tooltip-text,
.sidebar.collapsed .home-button:hover .tooltip-text {
  opacity: 1;
  visibility: visible;
}

/* Hover and Active States */
.sidebar-item:hover {
  background: linear-gradient(135deg, #e8f5d8 0%, #f0f9e6 100%);
  color: #2c3e50;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
}

.sidebar.collapsed .sidebar-item:hover {
  transform: none;
}

.sidebar-item:hover .item-content i {
  color: #4caf50;
}

.sidebar-item:hover .item-indicator {
  background: #4caf50;
}

.sidebar-item.router-link-active {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.sidebar-item.router-link-active .item-content i {
  color: white;
}

.sidebar-item.router-link-active .item-indicator {
  background: rgba(255, 255, 255, 0.8);
}

/* Bottom Section */
.sidebar-bottom {
  border-top: 1px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* Home Button */
.home-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  color: #495057;
  text-decoration: none;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, transparent 0%, transparent 100%);
  position: relative;
}

.home-button:hover {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  color: #1976d2;
  text-decoration: none;
}

.home-button-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.home-button-content i {
  font-size: 1.25rem;
  color: #6c757d;
  transition: color 0.3s ease;
  flex-shrink: 0;
}

.home-button:hover .home-button-content i {
  color: #1976d2;
}

.home-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  transition: opacity 0.3s ease;
}

.home-text span {
  font-size: 0.9rem;
  color: inherit;
}

.home-text small {
  font-size: 0.75rem;
  color: #6c757d;
}

.home-button > i {
  font-size: 1rem;
  color: #6c757d;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.home-button:hover > i {
  color: #1976d2;
  transform: translateX(4px);
}

/* Footer */
.sidebar-footer {
  padding: 1rem 1.5rem;
  transition: opacity 0.3s ease;
}

.footer-content {
  text-align: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.footer-logo i {
  font-size: 1.1rem;
}

.footer-logo span {
  font-size: 0.9rem;
  color: #2c3e50;
}

.footer-text small {
  color: #6c757d;
  font-size: 0.75rem;
}

/* Scrollbar Styling */
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Animation for active state */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar-item.router-link-active {
  animation: slideIn 0.3s ease;
}
</style>