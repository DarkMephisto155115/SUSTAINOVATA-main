<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Halaman Tidak Ditemukan</h1>
        <p class="error-message">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        
        <div class="illustration">
          <div class="planet"></div>
          <div class="astronaut">
            <i class="bi bi-person-fill"></i>
          </div>
        </div>
        
        <div class="action-buttons">
          <router-link to="/" class="btn-primary">
            <i class="bi bi-house-door me-2"></i>
            Kembali ke Beranda
          </router-link>
          <button @click="goBack" class="btn-secondary">
            <i class="bi bi-arrow-left me-2"></i>
            Kembali ke Halaman Sebelumnya
          </button>
        </div>
        
        <div class="helpful-links">
          <h3>Mungkin Anda mencari:</h3>
          <div class="links-grid">
            <router-link to="/about" class="helpful-link">
              <i class="bi bi-info-circle"></i>
              Tentang Kami
            </router-link>
            <router-link to="/programs" class="helpful-link">
              <i class="bi bi-collection"></i>
              Program & Inovasi
            </router-link>
            <router-link to="/contact" class="helpful-link">
              <i class="bi bi-envelope"></i>
              Kontak
            </router-link>
            <router-link to="/research" class="helpful-link">
              <i class="bi bi-journal-text"></i>
              Pusat Riset
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
  background-image: radial-gradient(circle at 50% 50%, rgba(90, 143, 0, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
}

.not-found-container {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.not-found-content {
  padding: 60px 40px;
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  color: #5a8f00;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.error-message {
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto 40px;
}

.illustration {
  position: relative;
  height: 200px;
  margin: 40px 0;
}

.planet {
  position: absolute;
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, #f9e94e 0%, #f9d423 100%);
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 60px rgba(249, 233, 78, 0.3);
}

.planet::before {
  content: '';
  position: absolute;
  width: 160px;
  height: 30px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  top: 85%;
  left: 50%;
  transform: translateX(-50%);
}

.astronaut {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 50%;
  left: calc(50% + 80px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  animation: float 6s ease-in-out infinite;
}

.astronaut i {
  font-size: 30px;
  color: #5a8f00;
}

@keyframes float {
  0% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(-30px) translateY(-15px);
  }
  100% {
    transform: translateY(-50%) translateX(0);
  }
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary {
  background-color: #5a8f00;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #4a7800;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background-color: #e9ecef;
}

.me-2 {
  margin-right: 0.5rem;
}

.helpful-links {
  margin-top: 40px;
}

.helpful-links h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.helpful-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
}

.helpful-link:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .not-found-content {
    padding: 40px 20px;
  }
  
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
  
  .illustration {
    height: 150px;
  }
  
  .planet {
    width: 100px;
    height: 100px;
  }
  
  .planet::before {
    width: 120px;
    height: 20px;
  }
  
  .astronaut {
    width: 50px;
    height: 50px;
    left: calc(50% + 60px);
  }
  
  .astronaut i {
    font-size: 24px;
  }
}
</style>