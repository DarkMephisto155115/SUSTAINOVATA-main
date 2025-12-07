<template>
  <div class="admin-content" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <div class="container-fluid py-4">
      <!-- Header Section -->
      <div class="dashboard-header mb-4">
        <div class="header-content">
          <div class="welcome-section">
            <h1 class="dashboard-title">
              <i class="bi bi-speedometer2 me-2 text-primary"></i>
              Dashboard Admin
            </h1>
            <p class="dashboard-subtitle">
              Selamat datang kembali, <span class="fw-bold text-primary">{{ user?.name || 'Admin' }}</span>
            </p>
          </div>
          <div class="header-stats">
            <div class="quick-stat">
              <i class="bi bi-clock-history text-warning"></i>
              <span>{{ getCurrentTime() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Overview -->
      <div class="stats-overview mb-4">
        <div class="row g-3">
          <div class="col-lg-4 col-md-6">
            <div class="stat-card stat-card-primary">
              <div class="stat-icon">
                <i class="bi bi-calendar-event"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ totalProgram }}</h3>
                <p class="stat-label">Total Program</p>
                <div class="stat-trend">
                  <!-- <i class="bi bi-arrow-up text-success"></i> -->
                  <!-- <span class="text-success">+12% dari bulan lalu</span> -->
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="stat-card stat-card-info">
              <div class="stat-icon">
                <i class="bi bi-newspaper"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ totalBerita }}</h3>
                <p class="stat-label">Total Berita</p>
                <div class="stat-trend">
                  <!-- <i class="bi bi-arrow-up text-success"></i> -->
                  <!-- <span class="text-success">+15% dari bulan lalu</span> -->
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="stat-card stat-card-warning">
              <div class="stat-icon">
                <i class="bi bi-envelope"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ totalMessages }}</h3>
                <p class="stat-label">Total Pesan</p>
                <div class="stat-trend">
                  <!-- <i class="bi bi-arrow-up text-success"></i> -->
                  <!-- <span class="text-success">+8% dari bulan lalu</span> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation mb-4">
        <div class="nav-wrapper">
          <ul class="nav nav-pills custom-nav-pills">
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === 'program' }" 
                @click.prevent="activeTab = 'program'" 
                href="#"
              >
                <i class="bi bi-calendar-event me-2"></i>
                <span>Program</span>
              </a>
            </li>

            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === 'berita' }" 
                @click.prevent="activeTab = 'berita'" 
                href="#"
              >
                <i class="bi bi-newspaper me-2"></i>
                <span>Berita</span>
              </a>
            </li>

            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === 'messages' }" 
                @click.prevent="activeTab = 'messages'" 
                href="#"
              >
                <i class="bi bi-envelope me-2"></i>
                <span>Pesan</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Tab Content -->
      <div class="tab-content-wrapper">
        <!-- Program Tab Content -->
        <div v-if="activeTab === 'program'" class="tab-content-section">
          <div class="section-header mb-4">
            <h2 class="section-title">
              <i class="bi bi-calendar-event me-2"></i>
              Program Terbaru
            </h2>
            <router-link to="/admin/kelola/program" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-eye me-1"></i>
              Lihat Semua
            </router-link>
          </div>
          
          <div class="content-grid">
            <div class="row g-4">
              <div class="col-xl-4 col-lg-6 col-md-6" v-for="(program, index) in programs" :key="index">
                <div class="content-card program-card">
                  <div class="card-header">
                    <div class="card-icon program-icon">
                      <i class="bi bi-calendar-event"></i>
                    </div>
                    <div class="card-status">
                      <span class="status-badge" :class="getStatusClass(program.status)">
                        {{ program.status }}
                      </span>
                    </div>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">{{ program.title }}</h5>
                    <div class="card-details">
                      <div class="detail-item">
                        <i class="bi bi-people text-primary"></i>
                        <span>{{ program.peserta }} Peserta</span>
                      </div>
                      <div class="detail-item">
                        <i class="bi bi-calendar-start text-success"></i>
                        <span>{{ program.mulai }}</span>
                      </div>
                      <div class="detail-item">
                        <i class="bi bi-calendar-check text-danger"></i>
                        <span>{{ program.selesai }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        <!-- Berita Tab Content -->
        <div v-if="activeTab === 'berita'" class="tab-content-section">
          <div class="section-header mb-4">
            <h2 class="section-title">
              <i class="bi bi-newspaper me-2"></i>
              Berita Terbaru
            </h2>
            <router-link to="/admin/kelola/berita" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-eye me-1"></i>
              Lihat Semua
            </router-link>
          </div>
          
          <div class="content-grid">
            <div class="row g-4">
              <div class="col-xl-4 col-lg-6 col-md-6" v-for="(news, index) in berita" :key="index">
                <div class="content-card berita-card">
                  <div class="card-header">
                    <div class="card-icon berita-icon">
                      <i class="bi bi-newspaper"></i>
                    </div>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title">{{ news.title }}</h5>
                    <p class="card-content">{{ news.content }}</p>
                    <div class="card-details">
                      <div class="detail-item">
                        <i class="bi bi-calendar3 text-primary"></i>
                        <span>{{ news.date }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages Tab Content -->
        <div v-if="activeTab === 'messages'" class="tab-content-section">
          <div class="section-header mb-4">
            <h2 class="section-title">
              <i class="bi bi-envelope me-2"></i>
              Pesan Kontak Terbaru
            </h2>
            <router-link to="/admin/kelola/messages" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-eye me-1"></i>
              Lihat Semua
            </router-link>
          </div>
          
          <div class="content-grid">
            <div class="card">
              <div class="card-body">
                <div v-if="messages.length === 0" class="text-center text-muted py-4">
                  <p>Tidak ada pesan</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Nama</th>
                        <th>Subjek</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(message, index) in messages.slice(0, 5)" :key="index">
                        <td>
                          <strong>{{ message.name }}</strong><br>
                          <small class="text-muted">{{ message.email }}</small>
                        </td>
                        <td>{{ message.subject }}</td>
                        <td>
                          <span :class="`badge bg-${getMessageStatusColor(message.status)}`">
                            {{ formatMessageStatus(message.status) }}
                          </span>
                        </td>
                        <td>{{ formatDate(message.created_at) }}</td>
                      </tr>
                    </tbody>
                  </table>
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
import { getToken, getUser } from '../../utils/auth.js';
import axios from 'axios';
import { ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate } from '../../utils/format.js';

const router = useRouter();

// Inject sidebar state (assuming parent component provides it)
const sidebarOpen = inject('sidebarOpen', ref(true));

// Reactive state
const activeTab = ref('program');
const isLoggedIn = ref(false);
const user = ref(null);

const berita = ref([]);
const programs = ref([]);
const messages = ref([]);

const totalProgram = ref(0);
const totalBerita = ref(0);
const totalMessages = ref(0);

// Helper functions
const getCurrentTime = () => {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Aktif':
    case 'Berjalan':
      return 'status-active';
    case 'Selesai':
      return 'status-completed';
    case 'Ditunda':
      return 'status-pending';
    case 'Dibatalkan':
      return 'status-cancelled';
    default:
      return 'status-default';
  }
};

const getMessageStatusColor = (status) => {
  const colors = {
    'new': 'danger',
    'read': 'warning',
    'replied': 'success'
  };
  return colors[status] || 'secondary';
};

const formatMessageStatus = (status) => {
  const statusLabels = {
    'new': 'Baru',
    'read': 'Dibaca',
    'replied': 'Dibalas'
  };
  return statusLabels[status] || status;
};

onMounted(() => {
  const token = getToken();
  const userData = getUser();
  
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    isLoggedIn.value = true;
    user.value = userData;
    console.log('Token found:', token);
    
    if (userData.role !== 'admin' && userData.role !== 'dev') {
      router.push('/not-found');
    } else {
      fetchDashboardData();
    }
  } else {
    router.push('/login');
  }
});

const fetchDashboardData = async () => {
  try {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const response = await axios.get('http://localhost:3000/api/admin/dashboard');
    const data = response.data;

    programs.value = data.recent.programs.map(item => ({
      title: item.name || '-',
      status: item.status || 'Berjalan',
      peserta: item.peserta?.toString() || '-',
      mulai: formatDate(item.start_date),
      selesai: formatDate(item.end_date),
    }));



    berita.value = data.recent.news.map(item => ({
      title: item.title,
      date: formatDate(item.date_published || item.date_upload),
      content: item.ringkasan || item.text?.substring(0, 100) || '-',
    }));

    const messagesResponse = await axios.get('http://localhost:3000/api/admin/messages', { headers });
    messages.value = messagesResponse.data.data || [];

    totalProgram.value = data.totals.programs;
    totalBerita.value = data.totals.news;
    totalMessages.value = messages.value.length;

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};
</script>

<style scoped>
/* Main Layout */
.admin-content {
  margin-left: 280px;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transition: margin-left 0.3s ease;
}

.admin-content.sidebar-collapsed {
  margin-left: 80px;
}

/* Header Section */
.dashboard-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.dashboard-subtitle {
  color: #6c757d;
  margin-bottom: 0;
  font-size: 1.1rem;
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: #495057;
  font-weight: 500;
}

/* Statistics Overview */
.stats-overview {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4caf50, #66bb6a);
}

.stat-card-primary::before {
  background: linear-gradient(90deg, #2196f3, #42a5f5);
}

.stat-card-success::before {
  background: linear-gradient(90deg, #4caf50, #66bb6a);
}

.stat-card-info::before {
  background: linear-gradient(90deg, #ff9800, #ffb74d);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
}

.stat-card-primary .stat-icon {
  background: linear-gradient(135deg, #2196f3, #42a5f5);
}

.stat-card-success .stat-icon {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
}

.stat-card-info .stat-icon {
  background: linear-gradient(135deg, #ff9800, #ffb74d);
}

.stat-card-warning::before {
  background: linear-gradient(90deg, #f44336, #ef5350);
}

.stat-card-warning .stat-icon {
  background: linear-gradient(135deg, #f44336, #ef5350);
}

.stat-content {
  flex-grow: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

/* Tab Navigation */
.tab-navigation {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.custom-nav-pills {
  gap: 0.5rem;
}

.custom-nav-pills .nav-link {
  color: #6c757d;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.custom-nav-pills .nav-link:hover {
  color: #4caf50;
  background: #f8f9fa;
  border-color: #e9ecef;
}

.custom-nav-pills .nav-link.active {
  color: white;
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  border-color: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* Tab Content */
.tab-content-wrapper {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

/* Content Cards */
.content-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #4caf50;
}

.card-header {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
}

.program-icon {
  background: linear-gradient(135deg, #2196f3, #42a5f5);
}

.publikasi-icon {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
}

.berita-icon {
  background: linear-gradient(135deg, #ff9800, #ffb74d);
}

.card-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-completed {
  background: #cce5ff;
  color: #004085;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.status-default {
  background: #e2e3e5;
  color: #383d41;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-content {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #495057;
}

.detail-item i {
  width: 16px;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .admin-content {
    margin-left: 0;
    padding: 1rem;
  }
  
  .admin-content.sidebar-collapsed {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .custom-nav-pills {
    flex-direction: column;
    width: 100%;
  }
  
  .custom-nav-pills .nav-link {
    justify-content: center;
  }
  
  .tab-content-wrapper {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .stat-content {
    text-align: center;
  }
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-content-section {
  animation: fadeInUp 0.3s ease;
}
</style>