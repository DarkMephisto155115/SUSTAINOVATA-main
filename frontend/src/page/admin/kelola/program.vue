<template>
  <div class="admin-content">
    <div class="container-fluid py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="mb-1 fw-bold">Daftar Program</h1>
              <p class="text-muted mb-0">Kelola semua program dan inovasi</p>
            </div>
            <router-link to="/admin/tambah/program" class="text-decoration-none">
              <button class="btn btn-tambah d-flex align-items-center gap-2">
                <i class="bi bi-plus-circle"></i>
                <span>Tambah Program</span>
              </button>
            </router-link>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-header">
                <tr>
                  <th class="fw-semibold">Program</th>
                  <th class="fw-semibold">Peserta</th>
                  <th class="fw-semibold">Periode</th>
                  <th class="fw-semibold">Status</th>
                  <th class="fw-semibold">Poster</th>
                  <th class="fw-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in programItems" :key="index" class="table-row">
                  <!-- Program Info -->
                  <td class="program-info">
                    <div v-if="editingId === item.ID_program" class="edit-mode">
                      <input 
                        v-model="item.name" 
                        class="form-control form-control-sm mb-2" 
                        placeholder="Nama Program"
                      />
                      <textarea 
                        v-model="item.description" 
                        class="form-control form-control-sm" 
                        rows="2"
                        placeholder="Deskripsi Program"
                      />
                    </div>
                    <div v-else class="program-details">
                      <h6 class="mb-1 fw-semibold text-dark">{{ item.name }}</h6>
                      <p class="mb-0 text-muted small">{{ truncateText(item.description, 80) }}</p>
                    </div>
                  </td>

                  <!-- Peserta -->
                  <td>
                    <div v-if="editingId === item.ID_program">
                      <input 
                        v-model="item.peserta" 
                        type="number" 
                        class="form-control form-control-sm" 
                        min="0"
                      />
                    </div>
                    <div v-else class="d-flex align-items-center gap-2">
                      <i class="bi bi-people text-primary"></i>
                      <span class="fw-medium">{{ item.peserta || 0 }}</span>
                    </div>
                  </td>

                  <!-- Periode -->
                  <td>
                    <div v-if="editingId === item.ID_program" class="date-inputs">
                      <input 
                        type="date" 
                        v-model="item.start_date" 
                        class="form-control form-control-sm mb-1" 
                      />
                      <input 
                        type="date" 
                        v-model="item.end_date" 
                        class="form-control form-control-sm" 
                      />
                    </div>
                    <div v-else class="date-range">
                      <div class="d-flex align-items-center gap-1 mb-1">
                        <i class="bi bi-calendar-event text-success"></i>
                        <small class="text-muted">Mulai:</small>
                        <span class="small fw-medium">{{ formatDate(item.start_date) }}</span>
                      </div>
                      <div class="d-flex align-items-center gap-1">
                        <i class="bi bi-calendar-check text-danger"></i>
                        <small class="text-muted">Selesai:</small>
                        <span class="small fw-medium">{{ formatDate(item.end_date) }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td>
                    <div v-if="editingId === item.ID_program">
                      <select v-model="item.status" class="form-select form-select-sm">
                        <option>Pendaftaran</option>
                        <option>Berjalan</option>
                        <option>Selesai</option>
                        <option>Dibatalkan</option>
                      </select>
                    </div>
                    <div v-else>
                      <span :class="getStatusBadgeClass(item.status)">
                        <i :class="getStatusIcon(item.status)"></i>
                        {{ item.status }}
                      </span>
                    </div>
                  </td>

                  <!-- Poster -->
                  <td>
                    <div v-if="editingId === item.ID_program">
                      <input 
                        type="file" 
                        @change="onFileChange($event, item, 'newPoster')"
                        class="form-control form-control-sm"
                        accept="image/*"
                      />
                    </div>
                    <div v-else class="poster-container">
                      <img 
                        :src="getImages(item.poster)" 
                        alt="Poster Program" 
                        class="poster-thumbnail"
                        @error="handleImageError"
                      />
                    </div>
                  </td>

                  <!-- Actions -->
                  <td>
                    <div class="action-buttons d-flex justify-content-center gap-2">
                      <button
                        v-if="editingId !== item.ID_program"
                        class="btn btn-edit btn-sm d-flex align-items-center gap-1"
                        @click="editingId = item.ID_program"
                        title="Edit Program"
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
                        @click="deleteProgram(item.ID_program)"
                        :disabled="editingId === item.ID_program"
                        title="Hapus Program"
                      >
                        <i class="bi bi-trash"></i>
                        <span class="d-none d-md-inline">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="programItems.length === 0">
                  <td colspan="6" class="text-center py-5">
                    <div class="empty-state">
                      <i class="bi bi-folder-x text-muted" style="font-size: 3rem;"></i>
                      <h5 class="text-muted mt-3">Tidak ada data program</h5>
                      <p class="text-muted">Mulai dengan menambahkan program baru</p>
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
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { formatDate } from '../../../utils/format.js';

const programItems = ref([]);
const editingId = ref(null);

const getImages = (imageName) => {
  return `http://localhost:3000/api/images/programs/${encodeURIComponent(imageName)}`;
};

const truncateText = (text, maxLength) => {
  if (!text) return '-';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getStatusBadgeClass = (status) => {
  const baseClass = 'badge d-flex align-items-center gap-1 ';
  switch (status) {
    case 'Pendaftaran':
      return baseClass + 'bg-info text-dark';
    case 'Berjalan':
      return baseClass + 'bg-success';
    case 'Selesai':
      return baseClass + 'bg-secondary';
    case 'Dibatalkan':
      return baseClass + 'bg-danger';
    default:
      return baseClass + 'bg-light text-dark';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pendaftaran':
      return 'bi bi-clock';
    case 'Berjalan':
      return 'bi bi-play-circle';
    case 'Selesai':
      return 'bi bi-check-circle';
    case 'Dibatalkan':
      return 'bi bi-x-circle';
    default:
      return 'bi bi-question-circle';
  }
};

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCAzMEM0MS4xMDQ2IDMwIDQyIDI5LjEwNDYgNDIgMjhDNDIgMjYuODk1NCA0MS4xMDQ2IDI2IDQwIDI2QzM4Ljg5NTQgMjYgMzggMjYuODk1NCAzOCAyOEMzOCAyOS4xMDQ2IDM4Ljg5NTQgMzAgNDAgMzBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0zNSAzNUw0MCAzMEw0NSAzNUgzNVoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
};

const fetchProgramData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/programs');
    programItems.value = response.data.map((item) => ({
      ...item,
      start_date: item.start_date? item.start_date.slice(0, 10) : '-',
      end_date: item.end_date? item.end_date.slice(0, 10) : '-',
    }));
  } catch (error) {
    console.error('Error fetching program data:', error);
    programItems.value = [];
  }
};

const saveEdit = async (item) => {
  try {
    const formData = new FormData();
    formData.append('ID_program', item.ID_program);
    formData.append('name', item.name);
    formData.append('description', item.description);
    formData.append('peserta', item.peserta);
    formData.append('start_date', item.start_date);
    formData.append('end_date', item.end_date);
    formData.append('status', item.status);

    if (item.newPoster) {
      formData.append('poster', item.newPoster)
    }

    for (let pair of formData.entries()){
      console.log(`${pair[0]}:`, pair[1])
    }

    await axios.put(
      `http://localhost:3000/api/admin/programs/${item.ID_program}`, formData
    );
    editingId.value = null;
    fetchProgramData();
  } catch (error) {
    console.error('Error updating program:', error);
  }
};

const onFileChange = (event, item, field) => {
  const file = event.target.files[0];
  if(file){
    item[field] = file;
  }
};

const deleteProgram = async (id) => {
  if (!confirm('Yakin ingin menghapus program ini?')) return;
  try {
    await axios.delete(`http://localhost:3000/api/admin/delete/programs/${id}`);
    fetchProgramData();
  } catch (error) {
    console.error('Error deleting program:', error);
  }
};

onMounted(() => {
  fetchProgramData();
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

.program-info {
  max-width: 300px;
}

.program-details h6 {
  color: #2c3e50;
  line-height: 1.4;
}

.date-range {
  min-width: 160px;
}

.poster-container {
  display: flex;
  justify-content: center;
}

.poster-thumbnail {
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e9ecef;
  transition: transform 0.2s ease;
}

.poster-thumbnail:hover {
  transform: scale(1.1);
  border-color: #6c757d;
}

.badge {
  font-size: 0.75rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-weight: 500;
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
  
  .program-info {
    max-width: 200px;
  }
  
  .date-range {
    min-width: 120px;
    font-size: 0.8rem;
  }
  
  .poster-thumbnail {
    width: 50px;
    height: 38px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem !important;
  }
  
  .btn-edit, .btn-simpan, .btn-hapus {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}
</style>