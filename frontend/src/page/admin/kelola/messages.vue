<template>
  <div class="admin-content">
    <div class="container-fluid py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="mb-1 fw-bold">Pesan Kontak</h1>
              <p class="text-muted mb-0">Kelola semua pesan dari pengunjung</p>
            </div>
            <div>
              <span class="badge bg-primary me-2">{{ unreadCount }} Belum Dibaca</span>
              <span class="badge bg-secondary">{{ messages.length }} Total</span>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-header">
                <tr>
                  <th class="fw-semibold">Nama & Email</th>
                  <th class="fw-semibold">Subjek</th>
                  <th class="fw-semibold">Topik</th>
                  <th class="fw-semibold">Status</th>
                  <th class="fw-semibold">Tanggal</th>
                  <th class="fw-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="messages.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    Tidak ada pesan
                  </td>
                </tr>
                <tr v-for="(message, index) in messages" :key="index" :class="message.status === 'new' ? 'table-active' : ''">
                  <td>
                    <div>
                      <h6 class="mb-1 fw-semibold">{{ message.name }}</h6>
                      <p class="mb-0 text-muted small">{{ message.email }}</p>
                    </div>
                  </td>
                  <td>
                    <span class="text-truncate">{{ message.subject }}</span>
                  </td>
                  <td>
                    <span class="badge bg-info">{{ message.topic }}</span>
                  </td>
                  <td>
                    <span :class="`badge bg-${getStatusColor(message.status)}`">
                      {{ formatStatus(message.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(message.created_at) }}</td>
                  <td class="text-center">
                    <button 
                      @click="viewMessage(message.id)" 
                      class="btn btn-sm btn-outline-primary me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#messageModal"
                    >
                      <i class="bi bi-eye"></i> Lihat
                    </button>
                    <button 
                      @click="deleteMessage(message.id)" 
                      class="btn btn-sm btn-outline-danger"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="messageModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detail Pesan</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedMessage">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Nama</h6>
                <p>{{ selectedMessage.name }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Email</h6>
                <p>{{ selectedMessage.email }}</p>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Subjek</h6>
                <p>{{ selectedMessage.subject }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Topik</h6>
                <p><span class="badge bg-info">{{ selectedMessage.topic }}</span></p>
              </div>
            </div>

            <div class="mb-3">
              <h6 class="text-muted small mb-1">Pesan</h6>
              <div class="card bg-light">
                <div class="card-body">
                  {{ selectedMessage.message }}
                </div>
              </div>
            </div>

            <div v-if="selectedMessage.attachment_path" class="mb-3">
              <h6 class="text-muted small mb-1">Lampiran</h6>
              <a :href="`http://localhost:3000/api/uploads/${selectedMessage.attachment_path}`" target="_blank" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-download me-1"></i>Download
              </a>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Status</h6>
                <select v-model="selectedMessage.status" @change="updateStatus" class="form-select form-select-sm">
                  <option value="new">Baru</option>
                  <option value="read">Dibaca</option>
                  <option value="replied">Dibalas</option>
                </select>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Tanggal</h6>
                <p>{{ formatDate(selectedMessage.created_at) }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { getToken } from '@/utils/auth';

const messages = ref([]);
const selectedMessage = ref(null);
const token = getToken();
const headers = { Authorization: `Bearer ${token}` };

const unreadCount = computed(() => messages.value.filter(m => m.status === 'new').length);

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const getStatusColor = (status) => {
  const colors = {
    'new': 'danger',
    'read': 'warning',
    'replied': 'success'
  };
  return colors[status] || 'secondary';
};

const formatStatus = (status) => {
  const statusLabels = {
    'new': 'Baru',
    'read': 'Dibaca',
    'replied': 'Dibalas'
  };
  return statusLabels[status] || status;
};

const loadMessages = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/admin/messages', { headers });
    messages.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading messages:', error);
    alert('Gagal memuat pesan: ' + (error.response?.data?.message || error.message));
  }
};

const viewMessage = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/admin/messages/${id}`, { headers });
    selectedMessage.value = response.data.data;
    await loadMessages();
  } catch (error) {
    console.error('Error loading message detail:', error);
    alert('Gagal memuat detail pesan');
  }
};

const updateStatus = async () => {
  try {
    await axios.put(`http://localhost:3000/api/admin/messages/${selectedMessage.value.id}/status`, 
      { status: selectedMessage.value.status }, 
      { headers }
    );
    await loadMessages();
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Gagal mengubah status');
  }
};

const deleteMessage = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
    try {
      await axios.delete(`http://localhost:3000/api/admin/messages/${id}`, { headers });
      await loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Gagal menghapus pesan');
    }
  }
};

onMounted(() => {
  loadMessages();
});
</script>

<style scoped>
.table-header {
  background-color: #f8f9fa;
  font-weight: 600;
}

.table-active {
  background-color: #fff3cd !important;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}
</style>
