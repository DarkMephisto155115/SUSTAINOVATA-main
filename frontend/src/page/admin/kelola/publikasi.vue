<template>
  <div class="admin-content">
    <div class="container-fluid py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="mb-1 fw-bold">Daftar Jurnal</h1>
              <p class="text-muted mb-0">Kelola publikasi ilmiah dan jurnal</p>
            </div>
            <router-link to="/admin/tambah/publikasi" class="text-decoration-none">
              <button class="btn btn-tambah d-flex align-items-center gap-2">
                <i class="bi bi-plus-circle"></i>
                <span>Tambah Jurnal</span>
              </button>
            </router-link>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-header">
                <tr>
                  <th class="fw-semibold">Publikasi</th>
                  <th class="fw-semibold">Penulis</th>
                  <th class="fw-semibold">Keywords</th>
                  <th class="fw-semibold">Tanggal</th>
                  <th class="fw-semibold">Cover</th>
                  <th class="fw-semibold">PDF</th>
                  <th class="fw-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in publikasiItems" :key="index" class="table-row">
                  <!-- Publikasi Info -->
                  <td class="publication-info">
                    <div v-if="editingId === item.ID_jurnal">
                      <input 
                        v-model="item.title" 
                        class="form-control form-control-sm" 
                        placeholder="Judul Jurnal"
                      />
                    </div>
                    <div v-else class="publication-details">
                      <h6 class="mb-0 fw-semibold text-dark">{{ truncateText(item.title, 60) }}</h6>
                    </div>
                  </td>

                  <!-- Penulis -->
                  <td>
                    <div v-if="editingId === item.ID_jurnal">
                      <input 
                        v-model="item.writer" 
                        class="form-control form-control-sm" 
                        placeholder="Nama Penulis"
                      />
                    </div>
                    <div v-else class="author-info">
                      <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-person-circle text-primary"></i>
                        <span class="fw-medium">{{ item.writer || '-' }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Keywords -->
                  <td>
                    <div v-if="editingId === item.ID_jurnal">
                      <input 
                        v-model="item.keyword" 
                        class="form-control form-control-sm" 
                        placeholder="Keywords"
                      />
                    </div>
                    <div v-else class="keywords-container">
                      <div class="keywords-tags">
                        <span 
                          v-for="(keyword, idx) in getKeywordArray(item.keyword)" 
                          :key="idx"
                          class="badge bg-secondary-subtle text-secondary me-1 mb-1"
                        >
                          {{ keyword }}
                        </span>
                        <span v-if="!item.keyword" class="text-muted">-</span>
                      </div>
                    </div>
                  </td>

                  <!-- Tanggal -->
                  <td>
                    <div v-if="editingId === item.ID_jurnal">
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
                    <div v-if="editingId === item.ID_jurnal">
                      <input 
                        type="file" 
                        @change="onFileChange($event, item, 'newCover')" 
                        class="form-control form-control-sm"
                        accept="image/*"
                      />
                    </div>
                    <div v-else class="cover-container">
                      <img 
                        :src="getImages(item.cover_image)" 
                        alt="Cover Jurnal" 
                        class="cover-thumbnail"
                        @error="handleImageError"
                      />
                    </div>
                  </td>

                  <!-- PDF -->
                  <td>
                    <div v-if="editingId === item.ID_jurnal">
                      <input 
                        type="file" 
                        @change="onFileChange($event, item, 'newFile')" 
                        class="form-control form-control-sm"
                        accept=".pdf"
                      />
                    </div>
                    <div v-else class="pdf-container">
                      <a 
                        :href="getFile(item.file)" 
                        target="_blank" 
                        class="btn btn-pdf btn-sm d-flex align-items-center gap-1"
                        title="Lihat PDF"
                      >
                        <i class="bi bi-file-earmark-pdf"></i>
                        <span class="d-none d-md-inline">PDF</span>
                      </a>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td>
                    <div class="action-buttons d-flex justify-content-center gap-2">
                      <button
                        v-if="editingId !== item.ID_jurnal"
                        class="btn btn-edit btn-sm d-flex align-items-center gap-1"
                        @click="editingId = item.ID_jurnal"
                        title="Edit Jurnal"
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
                        @click="deleteHandler(item.ID_jurnal)"
                        :disabled="editingId === item.ID_jurnal"
                        title="Hapus Jurnal"
                      >
                        <i class="bi bi-trash"></i>
                        <span class="d-none d-md-inline">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="publikasiItems.length === 0">
                  <td colspan="7" class="text-center py-5">
                    <div class="empty-state">
                      <i class="bi bi-journal-text text-muted" style="font-size: 3rem;"></i>
                      <h5 class="text-muted mt-3">Tidak ada data jurnal</h5>
                      <p class="text-muted">Mulai dengan menambahkan jurnal baru</p>
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
import { formatDate } from '../../../utils/format';

const getImages = (imageName) => {
  return `http://localhost:3000/api/images/jurnal/cover/${encodeURIComponent(imageName)}`;
};

const getFile = (pdfName) => {
  return `http://localhost:3000/api/images/jurnal/pdf/${encodeURIComponent(pdfName)}`;
};

const publikasiItems = ref([]);
const editingId = ref(null);

const truncateText = (text, maxLength) => {
  if (!text) return '-';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getKeywordArray = (keywords) => {
  if (!keywords) return [];
  return keywords.split(',').map(k => k.trim()).filter(k => k.length > 0).slice(0, 3);
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCAzMEM0MS4xMDQ2IDMwIDQyIDI5LjEwNDYgNDIgMjhDNDIgMjYuODk1NCA0MS4xMDQ2IDI2IDQwIDI2QzM4Ljg5NTQgMjYgMzggMjYuODk1NCAzOCAyOEMzOCAyOS4xMDQ2IDM4Ljg5NTQgMzAgNDAgMzBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0zNSAzNUw0MCAzMEw0NSAzNUgzNVoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
};

const fetchPublikasi = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/jurnal');
    publikasiItems.value = response.data.map((item) => ({
      ...item, 
      date_published: item.date_published?.slice(0, 10),
    }));
  } catch (error) {
    console.error('Error fetching publikasi:', error);
    publikasiItems.value = [];
  }
};

const deleteHandler = async (id) => {
  if (!confirm('Yakin ingin menghapus jurnal ini?')) return;
  try {
    await axios.delete(`http://localhost:3000/api/admin/jurnal/${id}`);
    fetchPublikasi();
  } catch (error) {
    console.error('Error deleting publikasi:', error);
  }
};

const saveEdit = async (item) => {
  try {
    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('writer', item.writer);
    formData.append('keyword', item.keyword);
    formData.append('date_published', item.date_published);

    if (item.newCover) {
      formData.append('cover_image', item.newCover);
    }
    if (item.newFile) {
      formData.append('file', item.newFile);
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    await axios.put(
      `http://localhost:3000/api/admin/jurnal/${item.ID_jurnal}`,formData
    );

    editingId.value = null;
    fetchPublikasi();
  } catch (error) {
    console.error('Error updating publikasi:', error);
  }
};

const onFileChange = (event, item, field) => {
  const file = event.target.files[0];
  if (file) {
    item[field] = file;
  }
};

onMounted(() => {
  fetchPublikasi();
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

.publication-info {
  max-width: 250px;
}

.publication-details h6 {
  color: #2c3e50;
  line-height: 1.4;
}

.keywords-container {
  max-width: 150px;
}

.keywords-tags .badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

.cover-container {
  display: flex;
  justify-content: center;
}

.cover-thumbnail {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e9ecef;
  transition: transform 0.2s ease;
}

.cover-thumbnail:hover {
  transform: scale(1.1);
  border-color: #6c757d;
}

.btn-pdf {
  background: linear-gradient(135deg, #fd7e14 0%, #e63946 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-pdf:hover {
  background: linear-gradient(135deg, #e8590c 0%, #d00000 100%);
  transform: translateY(-1px);
  color: white;
  text-decoration: none;
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
  
  .publication-info {
    max-width: 200px;
  }
  
  .keywords-container {
    max-width: 120px;
  }
  
  .cover-thumbnail {
    width: 50px;
    height: 65px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem !important;
  }
}
</style>