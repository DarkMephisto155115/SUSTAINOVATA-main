<template>
  <div class="program-detail-page">
    <button @click="$router.back()" class="btn btn-link text-decoration-none mb-3">
      <i class="bi bi-arrow-left me-2"></i>Kembali
    </button>

    <div class="container py-4">
      <div class="row">
        <div class="col-lg-8">
          <div class="card shadow-sm border-0 mb-4">
            <div v-if="program.poster" class="position-relative">
              <img :src="`http://localhost:3000/api/images/programs/${encodeURIComponent(program.poster)}`" :alt="program.name" class="card-img-top" style="max-height: 400px; object-fit: cover;">
              <div class="position-absolute top-0 end-0 m-3">
                <span :class="`badge bg-${getStatusColor(program.status)}`">{{ program.status }}</span>
              </div>
            </div>
            <div class="card-body">
              <h1 class="card-title text-success fw-bold mb-3">{{ program.name }}</h1>
              
              <div class="row mb-4">
                <div class="col-md-6">
                  <p class="text-muted"><strong>Jenis Program:</strong> {{ program.jenis_program }}</p>
                  <p class="text-muted"><strong>Peserta:</strong> {{ program.peserta }} orang</p>
                </div>
                <div class="col-md-6">
                  <p class="text-muted"><strong>Mulai:</strong> {{ formatDate(program.start_date) }}</p>
                  <p class="text-muted"><strong>Selesai:</strong> {{ formatDate(program.end_date) }}</p>
                </div>
              </div>

              <hr>

              <div class="program-description">
                <h3 class="text-success mb-3">Deskripsi Program</h3>
                <p class="fs-5">{{ program.description }}</p>
              </div>

              <hr>

              <div class="program-actions">
                <h3 class="text-success mb-3">Aksi</h3>
                <button class="btn btn-success btn-lg me-2">
                  <i class="bi bi-check-circle me-2"></i>Daftar Program
                </button>
                <button class="btn btn-outline-success btn-lg">
                  <i class="bi bi-share me-2"></i>Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm border-0 mb-3 sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold mb-3">Informasi Singkat</h5>
              
              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Status Program</h6>
                <p class="mb-0"><span :class="`badge bg-${getStatusColor(program.status)}`">{{ program.status }}</span></p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Total Peserta</h6>
                <p class="mb-0 fs-5 fw-bold">{{ program.peserta }}</p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Durasi Program</h6>
                <p class="mb-0">{{ calculateDuration(program.start_date, program.end_date) }} hari</p>
              </div>

              <div class="info-item">
                <h6 class="text-muted small mb-2">Tanggal Posting</h6>
                <p class="mb-0">{{ formatDate(program.add_date) }}</p>
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
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const program = ref({
  name: '',
  description: '',
  jenis_program: '',
  peserta: 0,
  status: '',
  start_date: '',
  end_date: '',
  poster: '',
  add_date: ''
});

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return days;
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Aktif':
    case 'Berjalan':
      return 'success';
    case 'Selesai':
      return 'secondary';
    case 'Ditunda':
      return 'warning';
    case 'Dibatalkan':
      return 'danger';
    default:
      return 'info';
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/clients/programs/${route.params.id}`);
    program.value = response.data.data;
  } catch (error) {
    console.error('Error fetching program:', error);
  }
});
</script>

<style scoped>
.program-detail-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

.card-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.program-description p {
  line-height: 1.8;
  color: #555;
}

.info-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.btn-success {
  background-color: #27ae60;
  border-color: #27ae60;
}

.btn-success:hover {
  background-color: #229954;
  border-color: #229954;
}

.btn-outline-success:hover {
  background-color: #27ae60;
  border-color: #27ae60;
  color: white;
}

@media (max-width: 768px) {
  .card-title {
    font-size: 1.5rem;
  }
  
  .sticky-top {
    position: static !important;
    margin-top: 1rem;
  }
}
</style>
