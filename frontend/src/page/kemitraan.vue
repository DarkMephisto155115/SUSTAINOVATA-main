<template>
  <div>
    <!-- Header Section -->
    <section class="header-section py-5">
      <div class="container py-4 text-center">
        <h1 class="display-4 fw-bold mb-3">Mitra Kami</h1>
        <p class="lead mx-auto" style="max-width: 700px;">
          Jaringan kolaborasi dengan berbagai lembaga penelitian, perguruan tinggi, komunitas, dan organisasi yang bersama-sama mendorong inovasi berkelanjutan.
        </p>
      </div>
    </section>
    
    <!-- Partners Logo Section -->
    <section class="py-5" style="background-color: aliceblue;">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-md-10">
            <div class="row g-4 justify-content-center">
              <!-- Partner Logo 1 -->
              <div class="col-4 col-md-2">
                <div class="bg-light p-3 rounded shadow-sm d-flex align-items-center justify-content-center" style="height: 100px;">
                  <img src="../assets/image/placeholder.png" alt="Partner 1" class="img-fluid" style="max-height: 80px;">
                </div>
              </div>
              
              <!-- Partner Logo 2 -->
              <div class="col-4 col-md-2">
                <div class="bg-light p-3 rounded shadow-sm d-flex align-items-center justify-content-center" style="height: 100px;">
                  <img src="../assets/image/placeholder.png" alt="Partner 2" class="img-fluid" style="max-height: 80px;">
                </div>
              </div>
              
              <!-- Partner Logo 3 -->
              <div class="col-4 col-md-2">
                <div class="bg-light p-3 rounded shadow-sm d-flex align-items-center justify-content-center" style="height: 100px;">
                  <img src="../assets/image/placeholder.png" alt="Partner 3" class="img-fluid" style="max-height: 80px;">
                </div>
              </div>
              
              <!-- Partner Logo 4 -->
              <div class="col-4 col-md-2">
                <div class="bg-light p-3 rounded shadow-sm d-flex align-items-center justify-content-center" style="height: 100px;">
                  <img src="../assets/image/placeholder.png" alt="Partner 4" class="img-fluid" style="max-height: 80px;">
                </div>
              </div>
              
              <!-- Partner Logo 5 -->
              <div class="col-4 col-md-2">
                <div class="bg-light p-3 rounded shadow-sm d-flex align-items-center justify-content-center" style="height: 100px;">
                  <img src="../assets/image/placeholder.png" alt="Partner 5" class="img-fluid" style="max-height: 80px;">
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Call to Action -->
        <div class="text-center mt-5 pt-4">
          <h4 class="mb-4">Tertarik menjadi kami dalam mengembangkan solusi berkelanjutan?</h4>
          <button @click="goToCollaboration" class="btn btn-light px-4 py-2 shadow-sm">
            Ajukan Kolaborasi
          </button>
        </div>
      </div>
    </section>
    
    <!-- Join Section -->
    <section class="py-5">
      <div class="container py-4 text-center">
        <h2 class="text-success fw-bold mb-4">Bergabunglah dalam Perjalanan Inovasi Berkelanjutan</h2>
        <p class="lead mx-auto mb-5" style="max-width: 700px;">
          Jadilah bagian dari ekosistem yang menciptakan solusi konkret untuk tantangan lingkungan dan sosial di era perubahan iklim.
        </p>
        <router-link to="/programs" class="btn btn-outline-success px-4 py-2">
          Daftar Program
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const partners = ref([]);
const loading = ref(false);

const fetchPartners = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:3000/api/clients/partners');
    if (response.data.success) {
      partners.value = response.data.data;
    }
  } catch (error) {
    console.error('Error fetching partners:', error);
  } finally {
    loading.value = false;
  }
};

const goToCollaboration = () => {
  router.push('/collaborations');
};

onMounted(() => {
  fetchPartners();
});
</script>

<style scoped>
.header-section {
  background-color: #f9e94e;
}

.bg-light {
  transition: transform 0.3s ease;
}

.bg-light:hover {
  transform: translateY(-5px);
}
</style>