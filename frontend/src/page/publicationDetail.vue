<template>
  <div class="publication-detail-page">
    <button @click="$router.back()" class="btn btn-link text-decoration-none mb-3">
      <i class="bi bi-arrow-left me-2"></i>Kembali
    </button>

    <div class="container py-4">
      <div class="row">
        <div class="col-lg-8">
          <div class="card shadow-sm border-0 mb-4">
            <div v-if="publication.cover_image" class="position-relative">
              <img :src="`http://localhost:3000/api/images/${encodeURIComponent(publication.cover_image)}`" :alt="publication.title" class="card-img-top" style="max-height: 400px; object-fit: cover;">
              <div v-if="publication.status" class="position-absolute top-0 end-0 m-3">
                <span :class="`badge bg-${getStatusColor(publication.status)}`">{{ publication.status }}</span>
              </div>
            </div>
            <div class="card-body">
              <h1 class="publication-title text-dark fw-bold mb-3">{{ publication.title }}</h1>
              
              <div class="publication-authors mb-4">
                <p class="mb-0"><strong>Penulis:</strong> {{ publication.writer }}</p>
              </div>

              <div class="row mb-4">
                <div class="col-md-6">
                  <p class="text-muted mb-2"><strong>Kata Kunci:</strong></p>
                  <div class="keyword-badges">
                    <span v-for="(keyword, index) in publication.keyword.split(',').filter(k => k.trim())" :key="index" class="badge bg-light text-dark me-1 mb-1">
                      {{ keyword.trim() }}
                    </span>
                  </div>
                </div>
                <div class="col-md-6">
                  <p class="text-muted"><strong>DOI:</strong> {{ publication.doi || 'N/A' }}</p>
                  <p class="text-muted"><strong>Tanggal Publikasi:</strong> {{ formatDate(publication.date_published) }}</p>
                </div>
              </div>

              <hr>

              <div class="publication-abstract">
                <h3 class="text-success mb-3">Abstrak</h3>
                <p class="fs-5">{{ publication.abstract }}</p>
              </div>

              <hr>

              <div class="publication-actions">
                <h3 class="text-success mb-3">Aksi</h3>
                <div class="d-flex gap-2 flex-wrap mb-3">
                  <button v-if="publication.file" @click="togglePdfViewer" class="btn btn-outline-success btn-lg">
                    <i class="bi bi-eye me-2"></i>{{ showPdfViewer ? 'Sembunyikan PDF' : 'Lihat PDF' }}
                  </button>
                  <a
                    v-if="pdfUrl"
                    :href="pdfUrl"
                    download
                    class="btn btn-success btn-lg me-2"
                  >
                    <i class="bi bi-download me-2"></i>Unduh PDF
                  </a>
                  <button class="btn btn-outline-success btn-lg">
                    <i class="bi bi-share me-2"></i>Bagikan
                  </button>
                </div>

                <!-- PDF Viewer -->
                <div v-if="showPdfViewer && pdfUrl" class="pdf-viewer-container mt-3">
                  <iframe
                    :src="pdfUrl"
                    class="pdf-embed"
                    frameborder="0"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm border-0 mb-3 sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold mb-3">Informasi Publikasi</h5>
              
              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Status</h6>
                <p class="mb-0"><span :class="`badge bg-${getStatusColor(publication.status)}`">{{ publication.status || 'Tersedia' }}</span></p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Penulis</h6>
                <p class="mb-0">{{ publication.writer }}</p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Tanggal Publikasi</h6>
                <p class="mb-0">{{ formatDate(publication.date_published) }}</p>
              </div>

              <div class="info-item">
                <h6 class="text-muted small mb-2">Tanggal Upload</h6>
                <p class="mb-0">{{ formatDate(publication.date_upload) }}</p>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 mt-3">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold mb-3">Publikasi Terkait</h5>
              <p class="text-muted small">Publikasi serupa akan ditampilkan di sini</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const publication = ref({
  title: '',
  writer: '',
  keyword: '',
  abstract: '',
  doi: '',
  file: '',
  cover_image: '',
  date_published: '',
  date_upload: '',
  status: ''
});
const showPdfViewer = ref(false);

const pdfUrl = computed(() => {
  if (!publication.value?.file) return null;
  return `http://localhost:3000/api/images/jurnal/pdf/${encodeURIComponent(publication.value.file)}`;
});

const togglePdfViewer = () => {
  showPdfViewer.value = !showPdfViewer.value;
};

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const getStatusColor = (status) => {
  switch(status) {
    case 'draft':
      return 'warning';
    case 'published':
      return 'success';
    case 'pending_review':
      return 'info';
    case 'revision_needed':
      return 'danger';
    default:
      return 'secondary';
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/clients/publications/${route.params.id}`);
    publication.value = response.data.data;
  } catch (error) {
    console.error('Error fetching publication:', error);
  }
});
</script>

<style scoped>
.publication-detail-page {
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

.publication-title {
  font-size: 2rem;
  line-height: 1.3;
}

.publication-abstract p {
  line-height: 1.8;
  color: #555;
}

.keyword-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

@media (max-width: 768px) {
  .publication-title {
    font-size: 1.5rem;
  }
  
  .sticky-top {
    position: static !important;
    margin-top: 1rem;
  }
}

.pdf-viewer-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.pdf-embed {
  width: 100%;
  height: 700px;
  display: block;
}
</style>
