<template>
  <div class="profile-page">
    <div class="container py-5">
      <!-- Back Button -->
      <router-link to="/" class="btn btn-secondary mb-4">
        <i class="bi bi-arrow-left"></i> Back to Home
      </router-link>

      <div class="row">
        <!-- Profile Card -->
        <div class="col-md-4 mb-4">
          <div class="card profile-card">
            <div class="card-body text-center">
              <div class="profile-avatar">
                <i class="bi bi-person-circle"></i>
              </div>
              <h3 class="mt-3">{{ user?.name || user?.username || 'User' }}</h3>
              <p class="text-muted">{{ user?.email }}</p>
              
              <!-- Role Badge -->
              <div class="role-badge-large">
                <span :class="`role-badge-${getRoleClass(user?.role)}`">
                  {{ getRoleLabel(user?.role) }}
                </span>
              </div>

              <!-- Profile Info -->
              <div class="profile-info mt-4">
                <div class="info-item">
                  <p class="info-label">Telephone</p>
                  <p class="info-value">{{ user?.telephone || 'Not set' }}</p>
                </div>
                <div class="info-item">
                  <p class="info-label">Address</p>
                  <p class="info-value">{{ user?.address || 'Not set' }}</p>
                </div>
              </div>

              <!-- Edit Profile Button -->
              <button @click="showEditForm = !showEditForm" class="btn btn-primary w-100 mt-4">
                <i class="bi bi-pencil"></i> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-8">
          <!-- Edit Form -->
          <div v-if="showEditForm" class="card mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Edit Profile</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateProfile">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Full Name</label>
                      <input v-model="editForm.name" type="text" class="form-control" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input v-model="editForm.email" type="email" class="form-control" required>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Telephone</label>
                      <input v-model="editForm.telephone" type="tel" class="form-control">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Username</label>
                      <input v-model="editForm.username" type="text" class="form-control">
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Address</label>
                  <textarea v-model="editForm.address" class="form-control" rows="3"></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-success" :disabled="isUpdating">
                    {{ isUpdating ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button type="button" @click="showEditForm = false" class="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Role Features -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Role Features & Quick Access</h5>
            </div>
            <div class="card-body">
              <!-- Admin Features -->
              <div v-if="user?.role === 'admin'" class="role-features">
                <h6 class="mb-3">
                  <span class="badge bg-primary">Admin</span> Features
                </h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="feature-box">
                      <div class="feature-icon">
                        <i class="bi bi-newspaper"></i>
                      </div>
                      <h6>Kelola Berita</h6>
                      <p>Manage and publish news articles</p>
                      <router-link to="/admin/kelola/berita" class="btn btn-sm btn-outline-primary">
                        Go to Berita <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="feature-box">
                      <div class="feature-icon">
                        <i class="bi bi-calendar-event"></i>
                      </div>
                      <h6>Kelola Program</h6>
                      <p>Manage and organize programs</p>
                      <router-link to="/admin/kelola/program" class="btn btn-sm btn-outline-primary">
                        Go to Program <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="feature-box">
                      <div class="feature-icon">
                        <i class="bi bi-envelope"></i>
                      </div>
                      <h6>Kelola Pesan</h6>
                      <p>View and manage contact messages</p>
                      <router-link to="/admin/kelola/messages" class="btn btn-sm btn-outline-primary">
                        Go to Messages <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Editor Features -->
              <div v-else-if="user?.role === 'editor'" class="role-features">
                <h6 class="mb-3">
                  <span class="badge bg-purple">Editor</span> Features
                </h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="feature-box">
                      <div class="feature-icon">
                        <i class="bi bi-book"></i>
                      </div>
                      <h6>Review Jurnal</h6>
                      <p>Review and approve journals</p>
                      <router-link to="/editor/journals" class="btn btn-sm btn-outline-primary">
                        Go to Journals <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="feature-box">
                      <div class="feature-icon">
                        <i class="bi bi-people"></i>
                      </div>
                      <h6>Kolaborasi</h6>
                      <p>Manage document collaborations</p>
                      <router-link to="/editor/collaborations" class="btn btn-sm btn-outline-primary">
                        Go to Collaborations <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="feature-box">
                      <div class="feature-icon">
                        <i class="bi bi-envelope"></i>
                      </div>
                      <h6>Kelola Pesan</h6>
                      <p>View and manage contact messages</p>
                      <router-link to="/editor/messages" class="btn btn-sm btn-outline-primary">
                        Go to Messages <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Author/User Features -->
              <div v-else class="role-features">
                <h6 class="mb-3">
                  <span class="badge bg-success">Author</span> Features
                </h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="feature-box">
                      <div class="feature-icon">
                        <i class="bi bi-journal-text"></i>
                      </div>
                      <h6>My Journals</h6>
                      <p>View and manage your journals</p>
                      <router-link to="/author/journals" class="btn btn-sm btn-outline-primary">
                        Go to Journals <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="feature-box">
                      <div class="feature-icon">
                        <i class="bi bi-plus-circle"></i>
                      </div>
                      <h6>Create Journal</h6>
                      <p>Create a new journal article</p>
                      <router-link to="/author/journals/create" class="btn btn-sm btn-outline-primary">
                        Create New <i class="bi bi-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getToken, getUser } from '@/utils/auth';

const token = getToken();
const user = ref(null);
const showEditForm = ref(false);
const isUpdating = ref(false);
const headers = { Authorization: `Bearer ${token}` };

const editForm = ref({
  name: '',
  email: '',
  telephone: '',
  username: '',
  address: ''
});

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

const updateProfile = async () => {
  isUpdating.value = true;
  try {
    const response = await axios.put('http://localhost:3000/api/clients/profile', editForm.value, { headers });
    
    if (response.data.success) {
      alert('Profile berhasil diperbarui!');
      user.value = { ...user.value, ...editForm.value };
      showEditForm.value = false;
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    alert('Error updating profile: ' + errorMsg);
  } finally {
    isUpdating.value = false;
  }
};

onMounted(() => {
  user.value = getUser();
  if (user.value) {
    editForm.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      telephone: user.value.telephone || '',
      username: user.value.username || '',
      address: user.value.address || ''
    };
  }
});
</script>

<style scoped>
.profile-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-top: 20px;
}

.profile-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
}

.profile-avatar {
  font-size: 80px;
  color: #5a8f00;
  margin-bottom: 20px;
}

.profile-card h3 {
  margin: 0;
  color: #333;
  font-weight: 700;
}

.profile-card .text-muted {
  margin-top: 5px;
  margin-bottom: 15px;
}

.role-badge-large {
  margin: 15px 0;
}

.role-badge-large span {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge-admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.role-badge-editor {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.role-badge-author,
.role-badge-user {
  background-color: #e8f5e9;
  color: #388e3c;
}

.role-badge-dev {
  background-color: #fff3e0;
  color: #f57c00;
}

.profile-info {
  text-align: left;
  border-top: 1px solid #e9ecef;
  padding-top: 15px;
}

.info-item {
  margin-bottom: 15px;
}

.info-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 5px;
}

.info-value {
  font-size: 14px;
  color: #333;
  margin: 0;
  word-break: break-word;
}

.card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.card-header {
  border-bottom: 1px solid #e9ecef;
}

.role-features {
  padding: 10px 0;
}

.role-features h6 {
  margin-bottom: 15px;
}

.badge {
  padding: 6px 12px;
  font-size: 11px;
}

.feature-box {
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-box:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  transform: translateY(-3px);
}

.feature-icon {
  font-size: 32px;
  color: #007bff;
  margin-bottom: 10px;
}

.feature-box h6 {
  margin: 10px 0 8px 0;
  color: #333;
  font-weight: 600;
}

.feature-box p {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.badge.bg-purple {
  background-color: #f3e5f5 !important;
  color: #7b1fa2 !important;
}

@media (max-width: 768px) {
  .profile-card {
    position: static;
  }

  .feature-box {
    padding: 15px;
  }

  .profile-avatar {
    font-size: 60px;
  }
}
</style>
