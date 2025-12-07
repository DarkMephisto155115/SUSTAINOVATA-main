<template>
  <div class="popup-container">
    <!-- Trigger button (user icon) -->
    <button @click="togglePopup" class="user-icon-button" ref="triggerButton" aria-label="User menu">
      <i v-if="isLoggedIn" class="bi bi-person-circle fs-4 text-success"></i>
      <i v-else class="bi bi-person-circle fs-4"></i>
    </button>

    <!-- Popup Overlay with animation -->
    <Transition name="popup">
      <div v-if="isOpen" class="popup-overlay" ref="popup">
        <div class="popup-content">
          <div class="popup-arrow"></div>
          
          <!-- Not Logged In State -->
          <div v-if="!isLoggedIn" class="auth-buttons">
            <button @click="login" class="btn-login">
              <i class="bi bi-box-arrow-in-right me-2"></i> Login
            </button>
            <button @click="register" class="btn-register">
              <i class="bi bi-person-plus me-2"></i> Register
            </button>
          </div>

          <!-- Logged In State -->
          <div v-else class="user-profile">
            <!-- User Avatar and Info Section -->
            <div class="profile-header">
              <div class="user-avatar">
                <i class="bi bi-person-circle"></i>
              </div>
              <div class="user-info">
                <p class="user-name">{{ user?.name || user?.username || 'User' }}</p>
                <p class="user-email">{{ user?.email || 'user@email.com' }}</p>
                <div class="user-role-badge">
                  <span :class="`role-${getRoleClass(user?.role)}`">{{ getRoleLabel(user?.role) }}</span>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="profile-divider"></div>

            <!-- Role-Based Navigation Buttons -->
            <div class="user-actions">
              <!-- Admin Buttons -->
              <template v-if="user?.role === 'admin'">
                <button class="btn-action btn-primary" @click="goTo('/admin/dashboard')">
                  <i class="bi bi-speedometer2"></i>
                  <span>Dashboard Admin</span>
                </button>
                <button class="btn-action btn-secondary" @click="goTo('/admin/kelola/berita')">
                  <i class="bi bi-newspaper"></i>
                  <span>Kelola Berita</span>
                </button>
                <button class="btn-action btn-secondary" @click="goTo('/admin/kelola/program')">
                  <i class="bi bi-calendar-event"></i>
                  <span>Kelola Program</span>
                </button>
                <button class="btn-action btn-secondary" @click="goTo('/admin/kelola/messages')">
                  <i class="bi bi-chat-dots"></i>
                  <span>Pesan</span>
                </button>
              </template>

              <!-- Editor Buttons -->
              <template v-else-if="user?.role === 'editor'">
                <button class="btn-action btn-primary" @click="goTo('/editor/dashboard')">
                  <i class="bi bi-speedometer2"></i>
                  <span>Editor Dashboard</span>
                </button>
                <button class="btn-action btn-secondary" @click="goTo('/editor/journals')">
                  <i class="bi bi-book"></i>
                  <span>Review Jurnal</span>
                </button>
                <button class="btn-action btn-secondary" @click="goTo('/editor/collaborations')">
                  <i class="bi bi-people"></i>
                  <span>Kolaborasi</span>
                </button>
              </template>

              <!-- Author/User Buttons -->
              <template v-else>
                <button class="btn-action btn-primary" @click="goTo('/author/journals')">
                  <i class="bi bi-journal-text"></i>
                  <span>My Journals</span>
                </button>
                <button class="btn-action btn-secondary" @click="goTo('/author/journals/create')">
                  <i class="bi bi-plus-circle"></i>
                  <span>Create Journal</span>
                </button>
              </template>

              <!-- Profile Button (for all) -->
              <button class="btn-action btn-secondary" @click="goToProfile">
                <i class="bi bi-person"></i>
                <span>Profil Saya</span>
              </button>
            </div>

            <!-- Logout Button -->
            <button @click="logout" class="btn-logout">
              <i class="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const isAdmin = ref(false);
// Props
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({
      email: 'user@example.com',
      username: 'Username',
      role: ''
    })
  }
  
});

// Emits
const emit = defineEmits(['login', 'register', 'logout']);

// Router
const router = useRouter();

// State
const isOpen = ref(false);
const triggerButton = ref(null);
const popup = ref(null);

// Helper Methods for Role Display
const getRoleLabel = (role) => {
  const roleLabels = {
    'admin': 'Admin',
    'editor': 'Editor',
    'author': 'Author',
    'user': 'User',
    'dev': 'Developer'
  };
  return roleLabels[role] || 'User';
};

const getRoleClass = (role) => {
  return role || 'user';
};

// Methods
const togglePopup = () => {
  isOpen.value = !isOpen.value;
};

const login = () => {
  emit('login');
  isOpen.value = false;
};

const register = () => {
  emit('register');
  isOpen.value = false;
};

const logout = () => {
  emit('logout');
  isOpen.value = false;
};

const dashboard = () => {
  if (props.user.role === 'admin' || props.user.role === 'dev') {
    emit('dashboard');
    isOpen.value = false;
  }
};

const goTo = (path) => {
  router.push(path);
  isOpen.value = false;
};

const goToProfile = () => {
  router.push('/profile');
  isOpen.value = false;
};

// Close popup when clicking outside
const handleClickOutside = (event) => {
  if (
    isOpen.value &&
    popup.value &&
    !popup.value.contains(event.target) &&
    triggerButton.value &&
    !triggerButton.value.contains(event.target)
  ) {
    isOpen.value = false;
  }
};

// Close popup when pressing Escape key
const handleEscKey = (event) => {
  if (isOpen.value && event.key === 'Escape') {
    isOpen.value = false;
  }
};

// Watch for login state changes
watch(() => props.isLoggedIn, (newValue) => {
  // If user logs out while popup is open, close it
  if (!newValue && isOpen.value) {
    isOpen.value = false;
  }
});

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('keydown', handleEscKey);
});
</script>

<style scoped>
.popup-container {
  position: relative;
}

.user-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.user-icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.user-icon-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(90, 143, 0, 0.3);
}

.popup-overlay {
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 1000;
  width: 300px;
}

.popup-content {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.popup-arrow {
  position: absolute;
  top: -8px;
  right: 16px;
  width: 16px;
  height: 16px;
  background-color: #ffffff;
  transform: rotate(45deg);
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* Animation */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Not Logged In State */
.auth-buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  padding: 20px;
}

.btn-login {
  background-color: #5a8f00;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-login:hover {
  background-color: #4a7800;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-register {
  background-color: #f9e94e;
  color: black;
  border: none;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-register:hover {
  background-color: #e6d73a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Logged In State */
.user-profile {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Profile Header Section */
.profile-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.user-avatar {
  font-size: 40px;
  color: #5a8f00;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  margin: 0;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role-badge {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.user-role-badge span {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-editor {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.role-author,
.role-user {
  background-color: #e8f5e9;
  color: #388e3c;
}

.role-dev {
  background-color: #fff3e0;
  color: #f57c00;
}

/* Divider */
.profile-divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 0;
}

/* Action Buttons Section */
.user-actions {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0;
  padding: 8px 0;
}

.btn-action {
  background-color: transparent;
  color: #333;
  border: none;
  padding: 12px 16px;
  width: 100%;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  text-align: left;
}

.btn-action:hover {
  background-color: #f8f9fa;
}

.btn-action:active {
  background-color: #e9ecef;
}

.btn-action i {
  width: 18px;
  text-align: center;
  font-size: 16px;
}

.btn-action span {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-action.btn-primary {
  background-color: #f0f7ff;
  color: #007bff;
  font-weight: 600;
  border-left: 3px solid #007bff;
  padding-left: 13px;
}

.btn-action.btn-primary:hover {
  background-color: #e7f1ff;
}

.btn-action.btn-secondary {
  color: #495057;
}

.btn-action.btn-secondary:hover {
  background-color: #f8f9fa;
  color: #212529;
}

/* Logout Button */
.btn-logout {
  background-color: #ffe5e5;
  color: #dc3545;
  border: none;
  border-radius: 0;
  padding: 12px 16px;
  margin: 8px 0 0 0;
  width: 100%;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border-top: 1px solid #e9ecef;
}

.btn-logout:hover {
  background-color: #ffc9cc;
  transform: none;
}

.btn-logout:active {
  background-color: #ffb0b0;
}

/* Mobile Responsive */
@media (max-width: 576px) {
  .popup-overlay {
    width: 280px;
    right: -20px;
  }

  .popup-content {
    border-radius: 8px;
  }

  .user-name {
    font-size: 14px;
  }

  .user-email {
    font-size: 11px;
  }
}
</style>
