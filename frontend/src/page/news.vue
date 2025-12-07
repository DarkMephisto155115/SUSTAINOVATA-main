<template>
  <div>
    <!-- Header Section -->
    <section class="header-section py-5">
      <div class="container py-4 text-center">
        <h1 class="display-4 fw-bold text-success mb-3">Berita Tentang Kami</h1>
        <p class="lead mx-auto" style="max-width: 700px;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac quam vehicula, facilisis urna non,
          egestas ipsum. Mauris ultricies viverra.
        </p>
      </div>
    </section>

    <!-- News Articles Section -->
    <section class="py-5">
      <div class="container">
        <CardNews
          v-for="(news, index) in paginatedNews"
          :key="index"
          :title="news.title"
          :publisher="news.publisher"
          :image="getImages(news.cover)"
          :link="`/news/${news.ID_berita}`"
          :description="truncateText(news.ringkasan, 150)"
          :publishDate="news.date_published"
        />

        <!-- Pagination -->
        <nav aria-label="News pagination" class="mt-5" v-if="totalPages > 1">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
            </li>

            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import CardNews from '../components/cards/berita.vue';

const newsData = ref([]);
const currentPage = ref(1);
const itemsPerPage = 6;

onMounted(() => { 
  fetchNews();
});

const fetchNews = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/clients/berita');
    newsData.value = response.data.map((item) => ({
      ...item,
      date_published: item.date_published?.slice(0, 10) || '',
    }));
  } catch (error) {
    // console.error('Error fetching news:', error);
    newsData.value = [];
  }
};

const totalPages = computed(() => Math.ceil(newsData.value.length / itemsPerPage));

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return newsData.value.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' }); // optional UX improvement
  }
};

const truncateText = (text, maxLength) => {
  if (!text) return '-';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getImages = (imageName) => {
  return `http://localhost:3000/api/images/berita/${encodeURIComponent(imageName)}`;
};
</script>

<style scoped>
.header-section {
  background-color: #f9e94e;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.object-fit-cover {
  object-fit: cover;
}

.page-link {
  color: #198754;
  cursor: pointer;
}

.page-item.active .page-link {
  background-color: #198754;
  border-color: #198754;
  color: #fff;
}
</style>
