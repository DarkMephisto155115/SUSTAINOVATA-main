<template>
  <footer class="footer py-5">
    <div class="container">
      <div class="row">
        <!-- Logo and description column -->
        <div class="col-lg-3 mb-4 mb-lg-0">
          <div class="mb-3">
            <img src="../assets/logo/Logo.png" alt="Logo" height="40" class="mb-3">
          </div>
          <p class="text-light small">
            Ekosistem inovasi berbasis STEAM untuk solusi berkelanjutan di bidang ekonomi hijau, ketahanan pangan, dan inovasi sosial.
          </p>
          <div class="social-icons d-flex gap-2 mt-3">
            <a href="#" class="social-icon">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" class="social-icon">
              <i class="bi bi-instagram"></i>
            </a>
          </div>
        </div>
        
        <!-- Tentang Kami column -->
        <div class="col-lg-3 mb-4 mb-lg-0">
          <h5 class="text-white mb-3">Tentang Kami</h5>
          <ul class="list-unstyled footer-links">
            <li><a href="#">Profil</a></li>
            <li><a href="#">Visi & Misi</a></li>
            <li><a href="#">Tim Kami</a></li>
            <li><a href="#">Mitra</a></li>
          </ul>
        </div>
        
        <!-- Program column -->
        <div class="col-lg-3 mb-4 mb-lg-0">
          <h5 class="text-white mb-3">Program</h5>
          <ul class="list-unstyled footer-links">
            <li><a href="#">Inovasi Hijau</a></li>
            <li><a href="#">Ketahanan Pangan</a></li>
            <li><a href="#">Teknologi Berkelanjutan</a></li>
            <li><a href="#">Pendidikan STEAM</a></li>
          </ul>
        </div>
        
        <!-- Kontak column -->
        <div class="col-lg-3">
          <h5 class="text-white mb-3">Kontak</h5>
          <ul class="list-unstyled footer-contact">
            <li>
              <i class="bi bi-geo-alt me-2"></i>
              <span>Jl. Inovasi No. 123, Jakarta</span>
            </li>
            <li>
              <i class="bi bi-envelope me-2"></i>
              <span>info@example.com</span>
            </li>
            <li>
              <i class="bi bi-telephone me-2"></i>
              <span>+62 123 4567 890</span>
            </li>
            <li>
              <i class="bi bi-clock me-2"></i>
              <span>Senin - Jumat: 08:00 - 17:00</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright section -->
      <div class="row mt-4 pt-4 border-top border-secondary">
        <div class="col-md-6 text-center text-md-start">
          <p class="text-light small mb-0">© 2023 All Rights Reserved</p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <p class="text-light small mb-0">
            <a href="#" class="text-light me-3">Privacy Policy</a>
            <a href="#" class="text-light">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
    name: 'Footer',
}
</script>

<style scoped>
.footer {
  background-color: #0a0a2e;
  color: #ffffff;
}

.footer h5 {
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a, 
.footer-contact span {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #ffffff;
  text-decoration: none;
}

.footer-contact li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}
</style>