<template>
  <div>  
    <!-- Hero Section with Background Image -->
    <section class="hero-section position-relative" style="height: 90dvh;">
      <div class="overlay"></div>
      <div class="container position-relative py-5">
        <div class="row min-vh-50 align-items-center justify-content-center py-5">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="display-4 fw-bold text-dark mb-3">Pusat Riset</h1>
            <p class="lead text-dark">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac quam vehicula, facilisis urna non, egestas ipsum. Mauris ultricies viverra.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Latest Research Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="d-inline-block bg-warning px-3 py-2 rounded-pill mb-4">
          <h5 class="mb-0 d-flex align-items-center">
            <i class="bi bi-lightbulb-fill me-2"></i>
            Riset Terkahir
          </h5>
        </div>
        
        <div class="row g-4">
          <div class="col-md-5">
            <img src="@/assets/image/pertanian-pintar.png" alt="Sistem Pertanian Pintar" class="img-fluid rounded shadow-sm">
          </div>
          <div class="col-md-7">
            <h2 class="text-success mb-3">Sistem Pertanian Pintar</h2>
            <p class="mb-2">
              Sistem Pertanian Pintar (Smart Farming System) yang dikembangkan oleh Sustainovata merupakan integrasi teknologi IoT dengan praktik pertanian yang menggabungkan teknologi digital, data real-time, dan pemberdayaan masyarakat lokal. Sistem ini dirancang untuk membantu petani mengatasi tantangan perubahan iklim dan keterbatasan sumber daya—mulai dari penanaman, pemeliharaan, hingga panen dan distribusi. Teknologi utama yang digunakan mencakup sensor ketelusuran tanah, pemantauan kelembaban udara, drone untuk pemetaan lahan, dan aplikasi mobile yang memungkinkan analisis kondisi lahan dan tanaman secara langsung dari aplikasi ponsel.
            </p>
            <p class="mb-2">
              Keunggulan sistem ini adalah kemampuannya untuk mengurangi ketergantungan pada intuisi atau perkiraan dalam aktivitas bertani. Melalui data yang dikumpulkan oleh sensor, petani dapat mengetahui secara pasti kapan waktu terbaik untuk menanam, memupuk, atau memanen. Selain itu, sistem ini juga membantu meminimalkan pemborosan input seperti pupuk, air, dan pestisida, sehingga lebih ramah lingkungan dan ekonomis. Sustainovata menekankan bahwa teknologi yang dikembangkan bersifat inklusif dan dapat diakses oleh petani, termasuk mereka yang belum terbiasa dengan perangkat digital.
            </p>
            <p>
              Tidak hanya berfokus pada teknologi, Sistem Pertanian Pintar Sustainovata juga mencakup komponen pemberdayaan masyarakat melalui program pelatihan teknis bagi petani, penyuluhan digital, serta pembangunan komunitas berbasis pengetahuan lokal. Sustainovata bekerja sama dengan universitas dan lembaga penelitian untuk terus mengembangkan sistem ini agar semakin relevan dengan kondisi geografis dan iklim lokal. Dengan pendekatan ini, sistem pertanian pintar tidak hanya menjadi alat bantu teknologi, tetapi juga katalisator perubahan sosial dan ekonomi di komunitas pertanian.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Other Research Section -->
    <section class="py-5">
      <div class="container">
        <div class="d-inline-block bg-warning px-3 py-2 rounded-pill mb-4">
          <h5 class="mb-0 d-flex align-items-center">
            <i class="bi bi-journals me-2"></i>
            Riset Lain
          </h5>
        </div>
        
        <div class="row g-4">
          <!-- Research Item 1 -->
          <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm">
              <div class="row g-0">
                <div class="col-md-5">
                  <img src="@/assets/image/poduk-kopi.png" class="img-fluid rounded-start h-100 object-fit-cover" alt="Seed Research">
                </div>
                <div class="col-md-7">
                  <div class="card-body">
                    <h4 class="card-title text-success">Title Research</h4>
                    <p class="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et sollicitudin turpis. Etiam fringilla ultricies tincidunt. Proin et eleifend felis, vel scelerisque nibh. Suspendisse porttitor, lacus ut fringilla rutrum, magna velit pellentesque ipsum, sit amet tempor nunc nisi at leo. In pulvinar eget nulla in feugiat. Donec ullamcorper posuere enim.
                    </p>
                    <router-link to="/research/1" class="btn btn-sm btn-outline-success d-flex align-items-center" style="width: fit-content;">
                      Selengkapnya <i class="bi bi-arrow-right ms-1"></i>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Research Item 2 -->
          <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm">
              <div class="row g-0">
                <div class="col-md-5">
                  <img src="@/assets/image/mesin-1.png" class="img-fluid rounded-start h-100 object-fit-cover" alt="Laboratory Equipment">
                </div>
                <div class="col-md-7">
                  <div class="card-body">
                    <h4 class="card-title text-success">Title Research</h4>
                    <p class="card-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et sollicitudin turpis. Etiam fringilla ultricies tincidunt. Proin et eleifend felis, vel scelerisque nibh. Suspendisse porttitor, lacus ut fringilla rutrum, magna velit pellentesque ipsum, sit amet tempor nunc nisi at leo. In pulvinar eget nulla in feugiat. Donec ullamcorper posuere enim.
                    </p>
                    <router-link to="/research/2" class="btn btn-sm btn-outline-success d-flex align-items-center" style="width: fit-content;">
                      Selengkapnya <i class="bi bi-arrow-right ms-1"></i>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Map Section -->
    <section class="py-5 bg-warning">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <h3 class="mb-4">Tempat riset</h3>
            <p class="mb-1">Jl. Mawar No. 32</p>
            <p class="mb-1">Kec. Lowokwaru</p>
            <p class="mb-1">Kota Malang</p>
            <p class="mb-4">10809</p>
            
            <router-link to="/contact" class="btn btn-success">
              Hubungi Kami
            </router-link>
          </div>
          <div class="col-md-8">
            <div class="bg-light rounded shadow-sm p-2">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126438.25644880422!2d112.55224489999999!3d-7.9786395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62822063dc2fb%3A0x78879446481a4da2!2sMalang%2C%20Kota%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1652345678901!5m2!1sid!2sid" 
                width="100%" 
                height="400" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  </div>
</template>

<script >

</script>

<style scoped>
.hero-section {
  background-image: url('../assets/background/bg-research-center.png'); 
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(249, 233, 78, 0.4);
}

.min-vh-50 {
  min-height: 50vh;
}

.object-fit-cover {
  object-fit: cover;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>