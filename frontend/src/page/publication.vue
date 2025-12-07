<template>
  <div>
    <!-- Header Section -->
    <section class="header-section py-2">
      <div class="container py-2 text-center">
        <h1 class="display-3 fw-bold mb-3">Publikasi Ilmiah</h1>
        <p class="lead mx-auto" style="max-width: 700px;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac quam vehicula, facilisis urna non, egestas ipsum. Mauris ultricies viverra.
        </p>
      </div>
    </section>
    
    <!-- First Publications Section -->
    <section class="py-5">
      <div class="container">
        <h2 class="text-success fw-bold mb-4 text-center">
          <span class="position-relative">
            Jurnal yang Dipublikasi
            <span class="position-absolute start-0 end-0 bottom-0 border-bottom border-2 border-success"></span>
          </span>
        </h2>
        
        <div class="row g-4 mt-3">
          <div class="col-md-6 col-lg-3" v-for="publication in publications" :key="publication.ID_jurnal">
            <div class="card h-100 border-0 shadow-sm" style="background-color: #f8ffe7">
              <img :src="getCoverImage(publication.cover_image)" class="card-img-top" :alt="publication.title">
              <div class="card-body">
                <h5 class="card-title fw-bold">{{ publication.title }}</h5>
                <p class="text-muted small mb-2">{{ publication.writer }}</p>
                <p class="card-text small">
                  {{ truncateText(publication.abstract, 100) }}
                </p>
              </div>
              <div class="card-footer border-0 pb-3" style="background-color: #f8ffe7">
                <router-link :to="`/publications/${publication.ID_jurnal}`" class="btn btn-sm btn-outline-success d-flex align-items-center" style="width: fit-content;">
                  Read More <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Second Publications Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-success fw-bold mb-4 text-center">
          <span class="position-relative">
            Jurnal yang Dipublikasi
            <span class="position-absolute start-0 end-0 bottom-0 border-bottom border-2 border-success"></span>
          </span>
        </h2>
        
        <div class="row g-4 mt-3">
          <!-- Publication Card 5 -->
          <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm" style="background-color: #f8ffe7">
              <img src="@/assets/image/poduk-kopi.png" class="card-img-top" alt="Seed Jars">
              <div class="card-body">
                <h5 class="card-title fw-bold">Title</h5>
                <p class="text-muted small mb-2">Name Writer</p>
                <p class="card-text small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum elementum risus, a dapibus est. Sed cursus luctus eros viverra.
                </p>
              </div>
              <div class="card-footer  border-0 pb-3" style="background-color: #f8ffe7">
                <router-link to="/publications/5" class="btn btn-sm btn-outline-success d-flex align-items-center" style="width: fit-content;">
                  Read More <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Publication Card 6 -->
          <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm" style="background-color: #f8ffe7">
              <img src="@/assets/image/tumbuhan-kopi.png" class="card-img-top" alt="Plant Research">
              <div class="card-body">
                <h5 class="card-title fw-bold">Title</h5>
                <p class="text-muted small mb-2">Name Writer</p>
                <p class="card-text small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum elementum risus, a dapibus est. Sed cursus luctus eros viverra.
                </p>
              </div>
              <div class="card-footer  border-0 pb-3" style="background-color: #f8ffe7">
                <router-link to="/publications/6" class="btn btn-sm btn-outline-success d-flex align-items-center" style="width: fit-content;">
                  Read More <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Publication Card 7 -->
          <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm" style="background-color: #f8ffe7">
              <img src="@/assets/image/mesin-kopi2.png" class="card-img-top" alt="Temperature Monitor">
              <div class="card-body">
                <h5 class="card-title fw-bold">Title</h5>
                <p class="text-muted small mb-2">Name Writer</p>
                <p class="card-text small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum elementum risus, a dapibus est. Sed cursus luctus eros viverra.
                </p>
              </div>
              <div class="card-footer  border-0 pb-3" style="background-color: #f8ffe7">
                <router-link to="/publications/7" class="btn btn-sm btn-outline-success d-flex align-items-center" style="width: fit-content;">
                  Read More <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Publication Card 8 -->
          <div class="col-md-6 col-lg-3">
            <div class="card h-100 border-0 shadow-sm" style="background-color: #f8ffe7">
              <img src="@/assets/image/aset2.png" class="card-img-top" alt="Researchers">
              <div class="card-body">
                <h5 class="card-title fw-bold">Title</h5>
                <p class="text-muted small mb-2">Name Writer</p>
                <p class="card-text small">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vestibulum elementum risus, a dapibus est. Sed cursus luctus eros viverra.
                </p>
              </div>
              <div class="card-footer  border-0 pb-3" style="background-color: #f8ffe7">
                <router-link to="/publications/8" class="btn btn-sm btn-outline-success d-flex align-items-center" style="width: fit-content;">
                  Read More <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const publications = ref([]);

onMounted(() => {
  fetchPublications();
});

const fetchPublications = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/clients/publikasi');
    publications.value = response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching publications:', error);
    publications.value = [];
  }
};

const truncateText = (text, maxLength) => {
  if (!text) return '-';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getCoverImage = (imageName) => {
  if (!imageName) return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E';
  return `http://localhost:3000/api/images/jurnal/cover/${encodeURIComponent(imageName)}`;
};
</script>

<style scoped>
.header-section {
  background-color: #f9e94e;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .card-img-top {
  transform: scale(1.05);
}
</style>