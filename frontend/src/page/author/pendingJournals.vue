<template>
  <div class="pending-journals-page">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Pending Journals</h1>
        <router-link to="/author/journals" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Back to My Journals
        </router-link>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="journals.length === 0" class="alert alert-info">
            No pending journals. All your submissions have been processed.
          </div>

          <div v-for="journal in journals" :key="journal.ID_jurnal" class="journal-card mb-3">
            <div class="row align-items-start">
              <div class="col-md-8">
                <h5 class="mb-1">{{ journal.title }}</h5>
                <p class="text-muted mb-2"><strong>Author:</strong> {{ journal.writer }}</p>
                <p class="text-muted mb-2">{{ journal.abstract.substring(0, 150) }}...</p>
                <div class="d-flex gap-2 flex-wrap">
                  <span :class="`badge bg-${getStatusColor(journal.status)}`">
                    {{ formatStatus(journal.status) }}
                  </span>
                  <span class="badge bg-secondary">Revision: {{ journal.revision_count }}</span>
                  <span class="badge bg-info">Submitted: {{ formatDate(journal.date_upload) }}</span>
                </div>
              </div>
              <div class="col-md-4 text-end">
                <router-link :to="`/author/journals/${journal.ID_jurnal}`" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-eye"></i> View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="journals.length > 0" class="card mt-4">
        <div class="card-header bg-light">
          <h5 class="mb-0">Status Guide</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 mb-2">
              <span class="badge bg-warning p-2">Pending Review</span>
              <p class="small mt-2">Waiting for editor review</p>
            </div>
            <div class="col-md-3 mb-2">
              <span class="badge bg-info p-2">Under Revision</span>
              <p class="small mt-2">Revision feedback received</p>
            </div>
            <div class="col-md-3 mb-2">
              <span class="badge bg-success p-2">Published</span>
              <p class="small mt-2">Approved and published</p>
            </div>
            <div class="col-md-3 mb-2">
              <span class="badge bg-danger p-2">Rejected</span>
              <p class="small mt-2">Not approved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getToken } from '@/utils/auth';
import moment from 'moment';

const token = getToken();
const headers = { Authorization: `Bearer ${token}` };

const journals = ref([]);

const getStatusColor = (status) => {
  const colors = {
    'pending_review': 'warning',
    'under_revision': 'info',
    'published': 'success',
    'rejected': 'danger'
  };
  return colors[status] || 'secondary';
};

const formatStatus = (status) => {
  const statusMap = {
    'pending_review': 'Pending Review',
    'under_revision': 'Under Revision',
    'published': 'Published',
    'rejected': 'Rejected'
  };
  return statusMap[status] || status;
};

const formatDate = (date) => {
  return moment(date).format('DD MMM YYYY');
};

const loadPendingJournals = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/author/journals', { headers });
    journals.value = res.data.data.filter(j => 
      j.status === 'pending_review' || 
      j.status === 'under_revision' || 
      j.status === 'rejection_needed'
    );
  } catch (error) {
    console.error('Error loading pending journals:', error);
    alert('Error loading journals: ' + error.response?.data?.message || error.message);
  }
};

onMounted(() => {
  loadPendingJournals();
});
</script>

<style scoped>
.pending-journals-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.journal-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
}

.journal-card:hover {
  border-color: #ffc107;
  box-shadow: 0 4px 8px rgba(255,193,7,0.1);
}

.journal-card h5 {
  color: #2c3e50;
  font-weight: 600;
}

.badge {
  font-size: 0.85rem;
  padding: 0.35rem 0.65rem !important;
}
</style>
