<template>
  <div class="card h-100 bg-light">
    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>

      <!-- Program type -->
      <div v-if="type === 'program'" class="publication-meta">
        <div><strong>Status:</strong> {{ status || 'Berjalan' }}</div>
        <div><strong>Peserta:</strong> {{ peserta }}</div>
        <div><strong>Mulai:</strong> {{ mulai }}</div>
        <div><strong>Selesai:</strong> {{ selesai }}</div>
      </div>

      <!-- Publikasi type -->
      <div v-if="type === 'publikasi'">
        <p class="card-text">{{ penulis }}</p>
        <div class="publication-meta">
          <div><strong>Jurnal:</strong> {{ jurnal }}</div>
          <div><strong>Tanggal:</strong> {{ tanggal }}</div>
        </div>
      </div>

      <!-- Berita type -->
      <div v-if="type === 'berita'">
        <p class="card-text text-muted">{{ date }}</p>
        <p class="card-text">{{ content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PublicationCard',
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['program', 'publikasi', 'berita'].includes(value)
    },
    title: {
      type: String,
      default: 'Title publication'
    },
    // Program
    status: String,
    peserta: [String, Number],
    mulai: String,
    selesai: String,
    // Publikasi
    penulis: String,
    jurnal: String,
    tanggal: String,
    // Berita
    date: String,
    content: String
  }
}
</script>
