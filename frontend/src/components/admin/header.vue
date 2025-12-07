<template>
  <header class="header d-flex justify-content-between align-items-center p-3">
    <div></div> 
    <!-- <div class="user-info d-flex align-items-center"> -->
      <div class="user-info d-flex align-items-center">
        <div class="user-details text-end me-3">
          <div class="user-name">{{ name }}</div>
          <div class="user-role">{{ division }}</div>
        </div>
        <div class="user-avatar">
          <div class="avatar-circle">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="status-indicator"></div>
        </div>
      </div>
      <!-- <div class="text-end me-3">
        <div class="fw-bold">{{ name }}</div>
        <div class="text-muted">{{ division }}</div>
      </div>
      <div class="user-avatar">
        <img src="https://via.placeholder.com/40" alt="User" class="rounded-circle">
         <i class="bi bi-person-circle"></i>
      </div> -->
    <!-- </div> -->
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getUser } from '../../utils/auth';

const name = ref('');
const division = ref('');

onMounted(() => {
  const user =getUser();
  name.value = user.email || '';
  division.value = user.role || '';
  
})
</script>

<style scoped>
.header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  height: 70px;
  position: fixed;
  top: 0;
  right: 0;
  left: 225px;
  z-index: 99;
}

/* .user-avatar img {
  width: 45px;
  height: 45px;
  border: 2px solid #ddd;
} */


.user-info {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 0.75rem 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.user-info:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-color: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.2);
}

.user-details {
  margin-right: 1rem;
}

.user-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
  line-height: 1.2;
}

.user-role {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.user-info:hover .avatar-circle {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.avatar-circle i {
  font-size: 1.5rem;
  color: white;
}
</style>