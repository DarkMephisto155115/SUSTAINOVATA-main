<template>
  <div class="resource-detail-page">
    <button @click="$router.back()" class="btn btn-link text-decoration-none mb-3">
      <i class="bi bi-arrow-left me-2"></i>Kembali
    </button>

    <div class="container py-4">
      <div class="row">
        <div class="col-lg-8">
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
              <h1 class="resource-title text-dark fw-bold mb-3">{{ resource.title || resource.name }}</h1>
              
              <div class="resource-meta mb-4">
                <span class="badge bg-success me-2">{{ resource.category }}</span>
                <span class="text-muted">
                  <i class="bi bi-calendar3 me-1"></i>{{ formatDate(resource.created_at) }}
                </span>
              </div>

              <hr>

              <div class="resource-description fs-5 lh-lg">
                <h3 class="text-success mb-3">Deskripsi</h3>
                <p>{{ resource.description }}</p>
              </div>

              <hr>

              <div class="resource-details">
                <h3 class="text-success mb-3">Informasi Lengkap</h3>
                
                <div v-if="resource.content" class="mb-4">
                  <h5 class="mb-2">Konten</h5>
                  <p class="text-muted">{{ resource.content }}</p>
                </div>

                <div v-if="resource.guidance" class="mb-4">
                  <h5 class="mb-2">Panduan Penggunaan</h5>
                  <p class="text-muted">{{ resource.guidance }}</p>
                </div>

                <div v-if="resource.benefits" class="mb-4">
                  <h5 class="mb-2">Manfaat</h5>
                  <p class="text-muted">{{ resource.benefits }}</p>
                </div>
              </div>

              <hr>

              <div class="resource-actions">
                <h3 class="text-success mb-3">Aksi</h3>
                <button class="btn btn-success btn-lg me-2">
                  <i class="bi bi-download me-2"></i>Unduh Sumber Daya
                </button>
                <button class="btn btn-outline-success btn-lg">
                  <i class="bi bi-share me-2"></i>Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold mb-3">Informasi Sumber Daya</h5>
              
              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Kategori</h6>
                <p class="mb-0"><span class="badge bg-success">{{ resource.category }}</span></p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Tipe Sumber Daya</h6>
                <p class="mb-0">{{ resource.type || 'Umum' }}</p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Tanggal Dibuat</h6>
                <p class="mb-0">{{ formatDate(resource.created_at) }}</p>
              </div>

              <div v-if="resource.status" class="info-item">
                <h6 class="text-muted small mb-2">Status</h6>
                <p class="mb-0"><span class="badge bg-success">{{ resource.status }}</span></p>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 mt-3">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold mb-3">Sumber Daya Terkait</h5>
              <p class="text-muted small">Sumber daya serupa akan ditampilkan di sini</p>
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
const resource = ref({
  title: '',
  name: '',
  category: '',
  description: '',
  content: '',
  guidance: '',
  benefits: '',
  type: '',
  status: '',
  created_at: ''
});

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/clients/resources/${route.params.id}`);
    resource.value = response.data.data;
  } catch (error) {
    console.error('Error fetching resource:', error);
  }
});
</script>

<style scoped>
.resource-detail-page {
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

.resource-title {
  font-size: 2rem;
  line-height: 1.2;
}

.resource-description p {
  line-height: 1.8;
  color: #555;
}

.resource-details h5 {
  font-weight: 600;
  color: #2c3e50;
}

.info-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .resource-title {
    font-size: 1.5rem;
  }
  
  .sticky-top {
    position: static !important;
    margin-top: 1rem;
  }
}
</style>
