<template>
  <div class="journals-list-page">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="mb-1">Daftar Jurnal</h1>
          <p class="text-muted mb-0">Kelola dan review jurnal dari author</p>
        </div>
        <div>
          <span class="badge bg-warning me-2">{{ pendingCount }} Pending</span>
          <span class="badge bg-secondary">{{ journals.length }} Total</span>
        </div>
      </div>

      <!-- Filter & Search Section -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control" 
                placeholder="Cari judul jurnal..."
              >
            </div>
            <div class="col-md-3">
              <select v-model="filterStatus" class="form-select">
                <option value="">Semua Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="published">Published</option>
                <option value="revision_needed">Needs Revision</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="sortBy" class="form-select">
                <option value="newest">Terbaru</option>
                <option value="oldest">Tertua</option>
                <option value="title_asc">Judul A-Z</option>
                <option value="title_desc">Judul Z-A</option>
              </select>
            </div>
            <div class="col-md-2">
              <button @click="resetFilters" class="btn btn-outline-secondary w-100">
                <i class="bi bi-arrow-clockwise me-1"></i>Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Journals Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Judul</th>
                <th>Penulis</th>
                <th>Abstrak</th>
                <th>Status</th>
                <th>Tanggal Upload</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredJournals.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  {{ journals.length === 0 ? 'Tidak ada jurnal' : 'Tidak ada jurnal yang cocok dengan filter' }}
                </td>
              </tr>
              <tr v-for="journal in filteredJournals" :key="journal.ID_jurnal" :class="getRowClass(journal.status)">
                <td>
                  <strong>{{ journal.title }}</strong>
                </td>
                <td>
                  <span>{{ journal.writer || journal.author_name || '-' }}</span>
                </td>
                <td>
                  <span class="text-truncate d-inline-block" style="max-width: 150px;" :title="journal.abstract">
                    {{ journal.abstract?.substring(0, 50) }}...
                  </span>
                </td>
                <td>
                  <span :class="`badge bg-${getStatusColor(journal.status)}`">
                    {{ formatStatus(journal.status) }}
                  </span>
                  <span v-if="journal.revision_count > 0" class="badge bg-info ms-2">
                    Rev: {{ journal.revision_count }}
                  </span>
                </td>
                <td>{{ formatDate(journal.date_upload) }}</td>
                <td>
                  <router-link 
                    :to="`/editor/journal/${journal.ID_jurnal}`" 
                    class="btn btn-sm btn-primary"
                  >
                    <i class="bi bi-pencil me-1"></i>Review
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Info -->
      <div class="text-center text-muted mt-3">
        <small>Menampilkan {{ filteredJournals.length }} dari {{ journals.length }} jurnal</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { getToken } from '@/utils/auth';

const journals = ref([]);
const searchQuery = ref('');
const filterStatus = ref('');
const sortBy = ref('newest');
const token = getToken();
const headers = { Authorization: `Bearer ${token}` };

const pendingCount = computed(() => journals.value.filter(j => j.status === 'pending_review').length);

const filteredJournals = computed(() => {
  let filtered = journals.value;

  if (searchQuery.value) {
    filtered = filtered.filter(j => 
      j.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (filterStatus.value) {
    filtered = filtered.filter(j => j.status === filterStatus.value);
  }

  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => new Date(b.date_upload) - new Date(a.date_upload));
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => new Date(a.date_upload) - new Date(b.date_upload));
  } else if (sortBy.value === 'title_asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy.value === 'title_desc') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  return filtered;
});

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const getStatusColor = (status) => {
  const colors = {
    'pending_review': 'warning',
    'published': 'success',
    'revision_needed': 'danger',
    'rejected': 'secondary',
    'draft': 'secondary'
  };
  return colors[status] || 'secondary';
};

const getRowClass = (status) => {
  if (status === 'pending_review') return 'table-warning';
  if (status === 'revision_needed') return 'table-danger';
  return '';
};

const formatStatus = (status) => {
  const statusLabels = {
    'pending_review': 'Pending Review',
    'published': 'Published',
    'revision_needed': 'Needs Revision',
    'rejected': 'Rejected',
    'draft': 'Draft'
  };
  return statusLabels[status] || status;
};

const resetFilters = () => {
  searchQuery.value = '';
  filterStatus.value = '';
  sortBy.value = 'newest';
};

const loadJournals = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/editor/journals', { headers });
    journals.value = res.data.data || [];
  } catch (error) {
    console.error('Error loading journals:', error);
    alert('Gagal memuat jurnal');
  }
};

onMounted(() => {
  loadJournals();
});
</script>

<style scoped>
.journals-list-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-light {
  background-color: #f8f9fa;
  font-weight: 600;
}

.table-warning {
  background-color: #fff3cd !important;
}

.table-danger {
  background-color: #f8d7da !important;
}

.btn-primary:hover {
  background-color: #0d6efd;
}

@media (max-width: 768px) {
  .table {
    font-size: 0.875rem;
  }
  
  .btn {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
