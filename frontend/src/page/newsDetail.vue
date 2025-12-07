<template>
  <div class="news-detail-page">
    <button @click="$router.back()" class="btn btn-link text-decoration-none mb-3">
      <i class="bi bi-arrow-left me-2"></i>Kembali
    </button>

    <div class="container py-4">
      <div class="row">
        <div class="col-lg-8">
          <article class="card shadow-sm border-0 mb-4">
            <div v-if="news.cover" class="position-relative">
              <img :src="`http://localhost:3000/api/images/${news.cover}`" :alt="news.title" class="card-img-top" style="max-height: 500px; object-fit: cover;">
            </div>
            <div class="card-body">
              <h1 class="article-title text-dark fw-bold mb-3">{{ news.title }}</h1>
              
              <div class="article-meta mb-4">
                <span class="text-muted me-3">
                  <i class="bi bi-calendar3 me-1"></i>{{ formatDate(news.date_published || news.date_upload) }}
                </span>
                <span class="badge bg-success">{{ news.kategori }}</span>
              </div>

              <hr>

              <div class="article-content fs-5 lh-lg">
                <p>{{ news.ringkasan }}</p>
                <p v-if="news.text">{{ news.text }}</p>
              </div>

              <hr>

              <div class="article-footer">
                <h5 class="text-success mb-3">Bagikan Berita Ini</h5>
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
              <h5 class="card-title text-success fw-bold mb-3">Informasi Berita</h5>
              
              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Kategori</h6>
                <p class="mb-0"><span class="badge bg-success">{{ news.kategori }}</span></p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Tanggal Publikasi</h6>
                <p class="mb-0">{{ formatDate(news.date_published || news.date_upload) }}</p>
              </div>

              <div class="info-item mb-3">
                <h6 class="text-muted small mb-2">Tanggal Upload</h6>
                <p class="mb-0">{{ formatDate(news.date_upload) }}</p>
              </div>

              <div class="info-item">
                <h6 class="text-muted small mb-2">Penulis</h6>
                <p class="mb-0">{{ news.penulis || 'Admin' }}</p>
              </div>
            </div>
          </div>

          <div class="card shadow-sm border-0 mt-3">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold mb-3">Berita Terkait</h5>
              <div v-if="relatedNews.length === 0" class="text-muted small">
                Tidak ada berita terkait
              </div>
              <div v-for="relatedItem in relatedNews" :key="relatedItem.ID_news" class="mb-3">
                <router-link :to="`/news/${relatedItem.ID_news}`" class="text-decoration-none">
                  <div class="related-news-item">
                    <h6 class="text-dark fw-500 mb-2">{{ relatedItem.title }}</h6>
                    <p class="text-muted small mb-0">{{ formatDate(relatedItem.date_published || relatedItem.date_upload) }}</p>
                  </div>
                </router-link>
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
const news = ref({
  title: '',
  kategori: '',
  ringkasan: '',
  text: '',
  cover: '',
  date_published: '',
  date_upload: '',
  penulis: ''
});
const relatedNews = ref([]);

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const loadRelatedNews = async (kategori) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/clients/news`);
    relatedNews.value = response.data.data
      .filter(item => item.kategori === kategori && item.ID_news !== parseInt(route.params.id))
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching related news:', error);
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/clients/news/${route.params.id}`);
    news.value = response.data.data;
    if (news.value.kategori) {
      await loadRelatedNews(news.value.kategori);
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  }
});
</script>

<style scoped>
.news-detail-page {
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

.related-news-item {
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 3px solid #4caf50;
}

.related-news-item:hover {
  background-color: #f8f9fa;
  border-left-color: #388e3c;
  transform: translateX(4px);
}

.related-news-item h6 {
  font-size: 0.95rem;
  line-height: 1.4;
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
