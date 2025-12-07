<template>
  <div class="research-detail-page">
    <button @click="$router.back()" class="btn btn-link text-decoration-none mb-3">
      <i class="bi bi-arrow-left me-2"></i>Kembali
    </button>

    <div class="container py-4">
      <div class="row">
        <div class="col-lg-8">
          <article class="card shadow-sm border-0 mb-4">
            <div v-if="research.image" class="position-relative">
              <img :src="require(`@/assets/image/${research.image}`)" :alt="research.title" class="card-img-top" style="max-height: 500px; object-fit: cover;">
            </div>
            <div class="card-body">
              <h1 class="article-title text-dark fw-bold mb-3">{{ research.title }}</h1>
              
              <div class="article-meta mb-4">
                <span class="text-muted me-3">
                  <i class="bi bi-calendar3 me-1"></i>{{ formatDate(research.created_at) }}
                </span>
                <span class="badge bg-success">{{ research.status }}</span>
              </div>

              <hr>

              <div class="article-content fs-5 lh-lg">
                <p v-for="(paragraph, index) in research.content.split('\n')" :key="index">
                  {{ paragraph }}
                </p>
              </div>

              <hr>

              <div class="article-footer">
                <h5 class="text-success mb-3">Bagikan Riset Ini</h5>
                <div class="share-buttons">
                  <button class="btn btn-outline-primary btn-sm me-2">
                    <i class="bi bi-facebook me-1"></i>Facebook
                  </button>
                  <button class="btn btn-outline-info btn-sm me-2">
                    <i class="bi bi-twitter me-1"></i>Twitter
                  </button>
                  <button class="btn btn-outline-success btn-sm">
                    <i class="bi bi-whatsapp me-1"></i>WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm border-0 sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold mb-3">Informasi Riset</h5>
              
              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Status</h6>
                <p class="mb-0"><span class="badge bg-success">{{ research.status }}</span></p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Deskripsi Singkat</h6>
                <p class="mb-0 small">{{ research.description }}</p>
              </div>

              <div class="info-item">
                <h6 class="text-muted small mb-2">Tanggal Dibuat</h6>
                <p class="mb-0">{{ formatDate(research.created_at) }}</p>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 mt-3">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold mb-3">Riset Lain</h5>
              <router-link to="/research" class="btn btn-sm btn-outline-success w-100">
                <i class="bi bi-arrow-left me-1"></i>Kembali ke Riset
              </router-link>
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
const research = ref({
  id: '',
  title: '',
  description: '',
  content: '',
  image: '',
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
    const response = await axios.get(`http://localhost:3000/api/clients/research/${route.params.id}`);
    research.value = response.data.data;
  } catch (error) {
    console.error('Error fetching research:', error);
  }
});
</script>

<style scoped>
.research-detail-page {
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

.article-title {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.article-meta {
  font-size: 0.95rem;
}

.article-content {
  color: #555;
  line-height: 1.9;
}

.article-content p {
  margin-bottom: 1.5rem;
}

.info-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.share-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.75rem;
  }
  
  .sticky-top {
    position: static !important;
    margin-top: 1rem;
  }

  .article-content {
    font-size: 0.95rem;
  }
}
</style>
