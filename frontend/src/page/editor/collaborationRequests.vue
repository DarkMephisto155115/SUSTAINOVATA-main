<template>
  <div class="collaboration-requests-page">
    <div class="container py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="mb-1 fw-bold">Permintaan Kolaborasi</h1>
              <p class="text-muted mb-0">Kelola permintaan kolaborasi dari user atau author</p>
            </div>
            <div>
              <span class="badge bg-warning me-2">{{ pendingCount }} Pending</span>
              <span class="badge bg-secondary">{{ requests.length }} Total</span>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-header">
                <tr>
                  <th class="fw-semibold">Dari</th>
                  <th class="fw-semibold">Judul Kolaborasi</th>
                  <th class="fw-semibold">Deskripsi</th>
                  <th class="fw-semibold">Status</th>
                  <th class="fw-semibold">Tanggal</th>
                  <th class="fw-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="requests.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    Tidak ada permintaan kolaborasi
                  </td>
                </tr>
                <tr v-for="(request, index) in requests" :key="index" :class="request.status === 'pending' ? 'table-active' : ''">
                  <td>
                    <div>
                      <h6 class="mb-1 fw-semibold">{{ request.from_user_name }}</h6>
                      <p class="mb-0 text-muted small">{{ request.from_user_email }}</p>
                    </div>
                  </td>
                  <td>
                    <strong>{{ request.title }}</strong>
                  </td>
                  <td>
                    <span class="text-truncate d-inline-block" style="max-width: 200px;">
                      {{ request.description || '-' }}
                    </span>
                  </td>
                  <td>
                    <span :class="`badge bg-${getStatusColor(request.status)}`">
                      {{ formatStatus(request.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(request.created_at) }}</td>
                  <td class="text-center">
                    <button 
                      v-if="request.status === 'pending'"
                      @click="viewRequest(request.ID_request)" 
                      class="btn btn-sm btn-outline-primary me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#requestModal"
                    >
                      <i class="bi bi-eye"></i> Lihat
                    </button>
                    <button 
                      v-else
                      @click="viewRequest(request.ID_request)" 
                      class="btn btn-sm btn-outline-secondary me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#requestModal"
                    >
                      <i class="bi bi-eye"></i> Detail
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="requestModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detail Permintaan Kolaborasi</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedRequest">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Dari</h6>
                <p><strong>{{ selectedRequest.from_user_name }}</strong></p>
                <p class="text-muted mb-0">{{ selectedRequest.from_user_email }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Status</h6>
                <p>
                  <span :class="`badge bg-${getStatusColor(selectedRequest.status)}`">
                    {{ formatStatus(selectedRequest.status) }}
                  </span>
                </p>
              </div>
            </div>

            <div class="mb-3">
              <h6 class="text-muted small mb-1">Judul Kolaborasi</h6>
              <p><strong>{{ selectedRequest.title }}</strong></p>
            </div>

            <div class="mb-3">
              <h6 class="text-muted small mb-1">Deskripsi</h6>
              <div class="card bg-light">
                <div class="card-body">
                  {{ selectedRequest.description || '-' }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Tanggal Permintaan</h6>
                <p>{{ formatDate(selectedRequest.created_at) }}</p>
              </div>
              <div v-if="selectedRequest.reviewed_at" class="col-md-6">
                <h6 class="text-muted small mb-1">Tanggal Review</h6>
                <p>{{ formatDate(selectedRequest.reviewed_at) }}</p>
              </div>
            </div>

            <div v-if="selectedRequest.status === 'rejected' && selectedRequest.rejection_reason" class="mb-3">
              <h6 class="text-muted small mb-1">Alasan Penolakan</h6>
              <div class="card bg-danger-light border-danger">
                <div class="card-body text-danger">
                  {{ selectedRequest.rejection_reason }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              v-if="selectedRequest && selectedRequest.status === 'pending'"
              @click="rejectRequest()" 
              class="btn btn-outline-danger"
              :disabled="isProcessing"
            >
              <i class="bi bi-x-circle me-1"></i>Tolak
            </button>
            <button 
              v-if="selectedRequest && selectedRequest.status === 'pending'"
              @click="acceptRequest()" 
              class="btn btn-success"
              :disabled="isProcessing"
            >
              <i class="bi bi-check-circle me-1"></i>{{ isProcessing ? 'Processing...' : 'Terima' }}
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rejection Modal -->
    <div class="modal fade" id="rejectModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tolak Permintaan Kolaborasi</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Alasan Penolakan</label>
              <textarea 
                v-model="rejectionReason" 
                class="form-control" 
                rows="4" 
                placeholder="Jelaskan alasan Anda menolak permintaan ini..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
            <button 
              @click="confirmReject()" 
              class="btn btn-danger"
              :disabled="!rejectionReason.trim()"
            >
              Tolak
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { getToken, getUser } from '@/utils/auth';
import { Modal } from 'bootstrap';

const requests = ref([]);
const selectedRequest = ref(null);
const token = getToken();
const user = getUser();
const headers = { Authorization: `Bearer ${token}` };
const isProcessing = ref(false);
const rejectionReason = ref('');

const pendingCount = computed(() => requests.value.filter(r => r.status === 'pending').length);

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const getStatusColor = (status) => {
  const colors = {
    'pending': 'warning',
    'accepted': 'success',
    'rejected': 'danger'
  };
  return colors[status] || 'secondary';
};

const formatStatus = (status) => {
  const statusLabels = {
    'pending': 'Pending',
    'accepted': 'Diterima',
    'rejected': 'Ditolak'
  };
  return statusLabels[status] || status;
};

const loadRequests = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/editor/collaboration-requests`,
      { headers }
    );
    requests.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading collaboration requests:', error);
    alert('Gagal memuat permintaan kolaborasi');
  }
};

const viewRequest = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/editor/collaboration-requests/${id}`,
      { headers }
    );
    selectedRequest.value = response.data.data;
    rejectionReason.value = '';
  } catch (error) {
    console.error('Error loading request detail:', error);
    alert('Gagal memuat detail permintaan');
  }
};

const acceptRequest = async () => {
  if (!selectedRequest.value) return;
  
  isProcessing.value = true;
  try {
    await axios.put(
      `http://localhost:3000/api/editor/collaboration-requests/${selectedRequest.value.ID_request}/accept`,
      {},
      { headers }
    );
    
    const modal = Modal.getInstance(document.getElementById('requestModal'));
    modal.hide();
    
    await loadRequests();
    alert('Permintaan kolaborasi diterima!');
  } catch (error) {
    console.error('Error accepting request:', error);
    alert('Gagal menerima permintaan: ' + (error.response?.data?.message || error.message));
  } finally {
    isProcessing.value = false;
  }
};

const rejectRequest = () => {
  const rejectModal = new Modal(document.getElementById('rejectModal'));
  rejectModal.show();
};

const confirmReject = async () => {
  if (!selectedRequest.value || !rejectionReason.value.trim()) return;
  
  isProcessing.value = true;
  try {
    await axios.put(
      `http://localhost:3000/api/editor/collaboration-requests/${selectedRequest.value.ID_request}/reject`,
      { rejection_reason: rejectionReason.value },
      { headers }
    );
    
    const rejectModal = Modal.getInstance(document.getElementById('rejectModal'));
    rejectModal.hide();
    
    const requestModal = Modal.getInstance(document.getElementById('requestModal'));
    requestModal.hide();
    
    await loadRequests();
    alert('Permintaan kolaborasi ditolak!');
  } catch (error) {
    console.error('Error rejecting request:', error);
    alert('Gagal menolak permintaan: ' + (error.response?.data?.message || error.message));
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  loadRequests();
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

.bg-danger-light {
  background-color: #f8d7da !important;
}
</style>
