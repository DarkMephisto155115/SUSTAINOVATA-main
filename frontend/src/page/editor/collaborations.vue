<template>
  <div class="collaborations-page">
    <div class="container py-4">
      <!-- Tab Navigation -->
      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            :class="{ active: activeTab === 'collaborations' }"
            @click="activeTab = 'collaborations'"
            type="button"
          >
            <i class="bi bi-people-fill me-2"></i>Kolaborasi Saya
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            :class="{ active: activeTab === 'requests' }"
            @click="activeTab = 'requests'"
            type="button"
          >
            <i class="bi bi-share-fill me-2"></i>Permintaan Kolaborasi
            <span v-if="pendingCount > 0" class="badge bg-warning ms-2">{{ pendingCount }}</span>
          </button>
        </li>
      </ul>

      <!-- Collaborations Tab -->
      <div v-show="activeTab === 'collaborations'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Kolaborasi Saya</h2>
          <button @click="showCreateForm = !showCreateForm" class="btn btn-primary">
            <i class="bi bi-plus-lg"></i> Kolaborasi Baru
          </button>
        </div>

      <div v-if="showCreateForm" class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Create New Collaboration</h5>
          <form @submit.prevent="createCollaboration">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input v-model="newCollab.title" type="text" class="form-control" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="newCollab.description" class="form-control" rows="3"></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Document</label>
              <input type="file" @change="onFileSelected" class="form-control" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Visibility</label>
              <select v-model="newCollab.visibility" class="form-control">
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-success" :disabled="isCreating">
                {{ isCreating ? 'Creating...' : 'Create' }}
              </button>
              <button type="button" @click="showCreateForm = false" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="row">
        <div v-for="collab in collaborations" :key="collab.ID_collab" class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ collab.title }}</h5>
              <p class="text-muted">{{ collab.description }}</p>
              <p class="small">
                <strong>Owner:</strong> {{ collab.owner_name }}<br>
                <strong>Members:</strong> {{ collab.member_count }}<br>
                <span :class="`badge bg-${collab.status === 'active' ? 'success' : 'secondary'}`">
                  {{ collab.status }}
                </span>
              </p>
            </div>
            <div class="card-footer bg-transparent">
              <router-link :to="`/editor/collaborations/${collab.ID_collab}`" class="btn btn-sm btn-outline-primary">
                View Details
              </router-link>
              <button v-if="collab.owner_id === userId" @click="deleteCollaboration(collab.ID_collab)" 
                      class="btn btn-sm btn-outline-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="collaborations.length === 0 && !showCreateForm" class="alert alert-info">
        No collaborations yet. Create one to get started!
      </div>
      </div>

      <!-- Collaboration Requests Tab -->
      <div v-show="activeTab === 'requests'">
        <div class="card">
          <div class="card-body">
            <h2 class="mb-4">Permintaan Kolaborasi</h2>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Dari</th>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="requests.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">Tidak ada permintaan kolaborasi</td>
                  </tr>
                  <tr v-for="request in requests" :key="request.ID_request" :class="request.status === 'pending' ? 'table-warning' : ''">
                    <td>
                      <strong>{{ request.organization_name || request.from_user_name || '-' }}</strong><br>
                      <small class="text-muted">{{ request.contact_email || request.from_user_email || '-' }}</small>
                    </td>
                    <td>{{ request.title }}</td>
                    <td>
                      <span :class="`badge bg-${getStatusColor(request.status)}`">
                        {{ formatStatus(request.status) }}
                      </span>
                    </td>
                    <td>{{ formatDate(request.created_at) }}</td>
                    <td>
                      <button 
                        v-if="request.status === 'pending'"
                        @click="viewRequest(request.ID_request)" 
                        class="btn btn-sm btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#requestModal"
                      >
                        Review
                      </button>
                      <span v-else class="text-muted small">Sudah direview</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Modal -->
    <div class="modal fade" id="requestModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Permintaan Kolaborasi</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedRequest">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Organisasi</h6>
                <p><strong>{{ selectedRequest.organization_name || selectedRequest.from_user_name || '-' }}</strong></p>
                <p class="text-muted text-break">{{ selectedRequest.contact_email || selectedRequest.from_user_email || '-' }}</p>
                <p class="text-muted" v-if="selectedRequest.contact_phone">{{ selectedRequest.contact_phone }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted small mb-1">Status</h6>
                <span :class="`badge bg-${getStatusColor(selectedRequest.status)}`">
                  {{ formatStatus(selectedRequest.status) }}
                </span>
              </div>
            </div>
            <div class="mb-3" v-if="selectedRequest.contact_name">
              <h6 class="text-muted small mb-1">Nama Kontak</h6>
              <p><strong>{{ selectedRequest.contact_name }}</strong></p>
            </div>
            <div class="mb-3">
              <h6 class="text-muted small mb-1">Judul</h6>
              <p><strong>{{ selectedRequest.title }}</strong></p>
            </div>
            <div class="mb-3">
              <h6 class="text-muted small mb-1">Deskripsi</h6>
              <p>{{ selectedRequest.description || '-' }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              v-if="selectedRequest && selectedRequest.status === 'pending'"
              @click="rejectRequest()" 
              class="btn btn-outline-danger"
              :disabled="isProcessing"
            >
              Tolak
            </button>
            <button 
              v-if="selectedRequest && selectedRequest.status === 'pending'"
              @click="acceptRequest()" 
              class="btn btn-success"
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Processing...' : 'Terima' }}
            </button>
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
import { getToken, getUser } from '@/utils/auth';
import { Modal } from 'bootstrap';

const token = getToken();
const user = getUser();
const userId = user?.ID_user;
const headers = { Authorization: `Bearer ${token}` };

const activeTab = ref('collaborations');
const collaborations = ref([]);
const requests = ref([]);
const selectedRequest = ref(null);
const showCreateForm = ref(false);
const isCreating = ref(false);
const isProcessing = ref(false);
const selectedFile = ref(null);
const newCollab = ref({
  title: '',
  description: '',
  visibility: 'private'
});

const pendingCount = computed(() => requests.value.filter(r => r.status === 'pending').length);

const onFileSelected = (event) => {
  selectedFile.value = event.target.files[0];
};

const createCollaboration = async () => {
  if (!newCollab.value.title || !selectedFile.value) {
    alert('Title and document are required');
    return;
  }

  isCreating.value = true;
  const formData = new FormData();
  formData.append('title', newCollab.value.title);
  formData.append('description', newCollab.value.description);
  formData.append('document_file', selectedFile.value);
  formData.append('visibility', newCollab.value.visibility);

  try {
    await axios.post('http://localhost:3000/api/editor/collaborations', formData, { 
      headers
    });
    alert('Collaboration created successfully!');
    showCreateForm.value = false;
    newCollab.value = { title: '', description: '', visibility: 'private' };
    selectedFile.value = null;
    loadCollaborations();
  } catch (error) {
    console.error('Create collaboration error:', error.response?.data || error.message);
    alert('Error creating collaboration: ' + error.response?.data?.message || error.message);
  } finally {
    isCreating.value = false;
  }
};

const deleteCollaboration = async (id) => {
  if (!confirm('Are you sure?')) return;

  try {
    await axios.delete(`http://localhost:3000/api/editor/collaborations/${id}`, { headers });
    alert('Collaboration deleted successfully!');
    loadCollaborations();
  } catch (error) {
    alert('Error: ' + error.response?.data?.message || error.message);
  }
};

const loadCollaborations = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/editor/collaborations', { headers });
    collaborations.value = res.data.data;
  } catch (error) {
    console.error('Error loading collaborations:', error);
  }
};

const loadRequests = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/editor/collaboration-requests', { headers });
    requests.value = res.data.data || [];
  } catch (error) {
    console.error('Error loading collaboration requests:', error);
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const getStatusColor = (status) => {
  const colors = { 'pending': 'warning', 'accepted': 'success', 'rejected': 'danger' };
  return colors[status] || 'secondary';
};

const formatStatus = (status) => {
  const statusLabels = { 'pending': 'Pending', 'accepted': 'Diterima', 'rejected': 'Ditolak' };
  return statusLabels[status] || status;
};

const viewRequest = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/editor/collaboration-requests/${id}`, { headers });
    selectedRequest.value = res.data.data;
  } catch (error) {
    console.error('Error loading request:', error);
    alert('Gagal memuat permintaan');
  }
};

const acceptRequest = async () => {
  if (!selectedRequest.value) return;
  isProcessing.value = true;
  try {
    await axios.put(`http://localhost:3000/api/editor/collaboration-requests/${selectedRequest.value.ID_request}/accept`, {}, { headers });
    const modal = Modal.getInstance(document.getElementById('requestModal'));
    modal.hide();
    await loadRequests();
    alert('Permintaan kolaborasi diterima!');
  } catch (error) {
    console.error('Error accepting:', error);
    alert('Gagal: ' + (error.response?.data?.message || error.message));
  } finally {
    isProcessing.value = false;
  }
};

const rejectRequest = async () => {
  if (!selectedRequest.value) return;
  const reason = prompt('Alasan penolakan:');
  if (!reason) return;
  
  isProcessing.value = true;
  try {
    await axios.put(`http://localhost:3000/api/editor/collaboration-requests/${selectedRequest.value.ID_request}/reject`, 
      { rejection_reason: reason }, { headers });
    const modal = Modal.getInstance(document.getElementById('requestModal'));
    modal.hide();
    await loadRequests();
    alert('Permintaan kolaborasi ditolak!');
  } catch (error) {
    console.error('Error rejecting:', error);
    alert('Gagal: ' + (error.response?.data?.message || error.message));
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  loadCollaborations();
  loadRequests();
});
</script>

<style scoped>
.collaborations-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
</style>
