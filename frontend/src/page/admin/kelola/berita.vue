<template>
  <div class="admin-content">
    <div class="container-fluid py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="mb-1 fw-bold">Daftar Berita</h1>
              <p class="text-muted mb-0">Kelola semua berita dan artikel</p>
            </div>
            <router-link to="/admin/tambah/berita" class="text-decoration-none">
              <button class="btn btn-tambah d-flex align-items-center gap-2">
                <i class="bi bi-plus-circle"></i>
                <span>Tambah Berita</span>
              </button>
            </router-link>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-header">
                <tr>
                  <th class="fw-semibold">Artikel</th>
                  <th class="fw-semibold">Kategori</th>
                  <th class="fw-semibold">Tanggal</th>
                  <th class="fw-semibold">Cover</th>
                  <th class="fw-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in beritaItems" :key="index" class="table-row">
                  <!-- Artikel Info -->
                  <td class="article-info">
                    <div v-if="editingId === item.ID_news" class="edit-mode">
                      <input 
                        v-model="item.title" 
                        class="form-control form-control-sm mb-2" 
                        placeholder="Judul Berita"
                      />
                      <textarea 
                        v-model="item.ringkasan" 
                        class="form-control form-control-sm" 
                        rows="2"
                        placeholder="Ringkasan Berita"
                      />
                    </div>
                    <div v-else class="article-details">
                      <h6 class="mb-1 fw-semibold text-dark">{{ item.title }}</h6>
                      <p class="mb-0 text-muted small">{{ truncateText(item.ringkasan, 100) }}</p>
                    </div>
                  </td>

                  <!-- Kategori -->
                  <td>
                    <div v-if="editingId === item.ID_news">
                      <input 
                        v-model="item.kategori" 
                        class="form-control form-control-sm" 
                        placeholder="Kategori"
                      />
                    </div>
                    <div v-else>
                      <span class="badge bg-primary-subtle text-primary px-3 py-2">
                        <i class="bi bi-tag me-1"></i>
                        {{ item.kategori || 'Umum' }}
                      </span>
                    </div>
                  </td>

                  <!-- Tanggal -->
                  <td>
                    <div v-if="editingId === item.ID_news">
                      <input 
                        type="date" 
                        v-model="item.date_published" 
                        class="form-control form-control-sm" 
                      />
                    </div>
                    <div v-else class="date-info">
                      <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-calendar3 text-primary"></i>
                        <span class="fw-medium">{{ formatDate(item.date_published) }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Cover -->
                  <td>
                    <div v-if="editingId === item.ID_news">
                      <input 
                        type="file" 
                        @change="onFileChange($event, item, 'newCover')" 
                        class="form-control form-control-sm"
                        accept="image/*"
                      />
                    </div>
                    <div v-else class="cover-container">
                      <img 
                        :src="getImages(item.cover)" 
                        alt="Cover Berita" 
                        class="cover-thumbnail"
                        @error="handleImageError"
                      />
                    </div>
                  </td>

                  <!-- Actions -->
                  <td>
                    <div class="action-buttons d-flex justify-content-center gap-2">
                      <button
                        v-if="editingId !== item.ID_news"
                        class="btn btn-edit btn-sm d-flex align-items-center gap-1"
                        @click="editingId = item.ID_news"
                        title="Edit Berita"
                      >
                        <i class="bi bi-pencil"></i>
                        <span class="d-none d-md-inline">Edit</span>
                      </button>
                      <button
                        v-else
                        class="btn btn-simpan btn-sm d-flex align-items-center gap-1"
                        @click="saveEdit(item)"
                        title="Simpan Perubahan"
                      >
                        <i class="bi bi-check-lg"></i>
                        <span class="d-none d-md-inline">Simpan</span>
                      </button>
                      <button
                        class="btn btn-hapus btn-sm d-flex align-items-center gap-1"
                        @click="deleteHandler(item.ID_news)"
                        :disabled="editingId === item.ID_news"
                        title="Hapus Berita"
                      >
                        <i class="bi bi-trash"></i>
                        <span class="d-none d-md-inline">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="beritaItems.length === 0">
                  <td colspan="5" class="text-center py-5">
                    <div class="empty-state">
                      <i class="bi bi-newspaper text-muted" style="font-size: 3rem;"></i>
                      <h5 class="text-muted mt-3">Tidak ada data berita</h5>
                      <p class="text-muted">Mulai dengan menambahkan berita baru</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { formatDate } from '../../../utils/format.js';

const beritaItems = ref([]);
const editingId = ref(null);

const getImages = (imageName) => {
  return `http://localhost:3000/api/images/berita/${encodeURIComponent(imageName)}`;
};

const truncateText = (text, maxLength) => {
  if (!text) return '-';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCAzMEM0MS4xMDQ2IDMwIDQyIDI5LjEwNDYgNDIgMjhDNDIgMjYuODk1NCA0MS4xMDQ2IDI2IDQwIDI2QzM4Ljg5NTQgMjYgMzggMjYuODk1NCAzOCAyOEMzOCAyOS4xMDQ2IDM4Ljg5NTQgMzAgNDAgMzBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0zNSAzNUw0MCAzMEw0NSAzNUgzNVoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
};

const fetchBeritaData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/berita');
    beritaItems.value = response.data.map((item) => ({
      ...item,
      date_published: item.date_published?.slice(0, 10)
    }));
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching berita data:', error);
    beritaItems.value = [];
  }
};

const onFileChange = (event, item, field) => {
  const file = event.target.files[0];
  if(file){
    item[field] = file;
  }
}

const saveEdit = async (item) => {
  try {
    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('kategori', item.kategori);
    formData.append('date_published', item.date_published);
    formData.append('ringkasan', item.ringkasan);
    
    if (item.newCover) {
      formData.append('cover', item.newCover);
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    await axios.put(
      `http://localhost:3000/api/admin/berita/${item.ID_news}`, formData
    );
    
    editingId.value = null; 
    fetchBeritaData();
  }catch (error) {
    console.error('Error saving berita:', error);
  }
};

const deleteHandler = async (id) => {
  if (!confirm('Yakin ingin menghapus berita ini?')) return;
  try {
    await axios.delete(`http://localhost:3000/api/admin/delete/berita/${id}`);
    fetchBeritaData();
  } catch (error) {
    console.error('Error deleting berita:', error);
  }
};

onMounted(() => {
  fetchBeritaData();
});
</script>

<style scoped>
.admin-content {
  margin-left: 225px;
  margin-top: 70px;
  padding: 20px;
}

.card {
  border-radius: 12px;
  border: 1px solid #e9ecef;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}

.table-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 2px solid #dee2e6;
}

.table-header th {
  border: none;
  padding: 1rem 0.75rem;
  font-size: 0.875rem;
  color: #495057;
}

.table-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f3f4;
}

.table-row:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.article-info {
  max-width: 350px;
}

.article-details h6 {
  color: #2c3e50;
  line-height: 1.4;
}

.cover-container {
  display: flex;
  justify-content: center;
}

.cover-thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: transform 0.2s ease;
}

.cover-thumbnail:hover {
  transform: scale(1.1);
  border-color: #6c757d;
}

.action-buttons {
  min-width: 120px;
}

/* Button Styles */
.btn-tambah {
  background: linear-gradient(135deg, #6f42c1 0%, #8a2be2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(106, 66, 193, 0.3);
}

.btn-tambah:hover {
  background: linear-gradient(135deg, #5a359a 0%, #7a1ea1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(106, 66, 193, 0.4);
  color: white;
}

.btn-edit {
  background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #138496 0%, #1e7e34 100%);
  transform: translateY(-1px);
  color: white;
}

.btn-simpan {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-simpan:hover {
  background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
  transform: translateY(-1px);
  color: white;
}

.btn-hapus {
  background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-hapus:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #c0392b 100%);
  transform: translateY(-1px);
  color: white;
}

.btn-hapus:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-mode .form-control {
  border: 2px solid #6f42c1;
  border-radius: 6px;
}

.edit-mode .form-control:focus {
  border-color: #8a2be2;
  box-shadow: 0 0 0 0.2rem rgba(111, 66, 193, 0.25);
}

.empty-state {
  padding: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-content {
    margin-left: 0;
    padding: 10px;
  }
  
  .article-info {
    max-width: 250px;
  }
  
  .cover-thumbnail {
    width: 60px;
    height: 45px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem !important;
  }
}
</style>