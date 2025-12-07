<template>
  <div class="container-fluid py-4">
    <h1 class="mb-4">Ringkasan</h1>
    
    <!-- Publikasi Terbaru Section -->
    <h2 class="mb-3">Publikasi Terbaru</h2>
    <div class="row mb-4">
      <div class="col-md-4 mb-3" v-for="(publication, index) in latestPublications" :key="index">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">Title publication</h3>
            <p class="card-text">Nama Penulis</p>
            <div class="publication-meta">
              <div><strong>Jurnal:</strong> Jenis Jurnal</div>
              <div><strong>Tanggal:</strong> Tanggal-terbit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Statistics Cards -->
    <div class="row">
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">Total Program</h3>
            <p class="card-text display-4">3</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">Total Publikasi</h3>
            <p class="card-text display-4">3</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">Total Berita</h3>
            <p class="card-text display-4">3</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tab Navigation -->
    <div class="card mt-4">
      <div class="card-body">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'program' }" @click="activeTab = 'program'" href="#">Program</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'publikasi' }" @click="activeTab = 'publikasi'" href="#">Publikasi</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === 'berita' }" @click="activeTab = 'berita'" href="#">Berita</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      activeTab: 'program',
      latestPublications: [1, 2, 3] // Dummy data for 3 publications
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
}

.publication-meta {
  font-size: 14px;
  color: #666;
}

.nav-pills .nav-link {
  color: #333;
}

.nav-pills .nav-link.active {
  background-color: #f8f9fa;
  color: #000;
}
</style>