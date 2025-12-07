<template>
  <div class="my-journals-page">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>My Journals</h1>
        <div class="d-flex gap-2">
          <router-link to="/author/journals/pending" class="btn btn-info">
            <i class="bi bi-clock-history"></i> Pending Journals
          </router-link>
          <router-link to="/author/journals/create" class="btn btn-primary">
            <i class="bi bi-plus-lg"></i> Create Journal
          </router-link>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3 mb-4">
          <div class="stat-box">
            <p class="stat-label">Draft</p>
            <p class="stat-value">{{ stats.draft }}</p>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="stat-box">
            <p class="stat-label">Pending Review</p>
            <p class="stat-value">{{ stats.pending_review }}</p>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="stat-box">
            <p class="stat-label">Published</p>
            <p class="stat-value">{{ stats.published }}</p>
          </div>
        </div>
        <div class="col-md-3 mb-4">
          <div class="stat-box">
            <p class="stat-label">Rejected</p>
            <p class="stat-value">{{ stats.rejected }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div v-if="journals.length === 0" class="alert alert-info">
            You haven't created any journals yet. <router-link to="/author/journals/create">Create one now</router-link>
          </div>

          <div v-for="journal in journals" :key="journal.ID_jurnal" class="journal-card mb-3">
            <div class="row align-items-center">
              <div class="col-md-8">
                <h5 class="mb-1">{{ journal.title }}</h5>
                <p class="text-muted mb-1">{{ journal.abstract.substring(0, 100) }}...</p>
                <div class="d-flex gap-2">
                  <span :class="`badge bg-${getStatusColor(journal.status)}`">
                    {{ journal.status }}
                  </span>
                  <span class="badge bg-secondary">Revision: {{ journal.revision_count }}</span>
                </div>
              </div>
              <div class="col-md-4 text-end">
                <router-link :to="`/author/journals/${journal.ID_jurnal}`" class="btn btn-sm btn-outline-primary me-2">
                  View
                </router-link>
                <button v-if="journal.status === 'draft'" 
                        @click="deleteJournal(journal.ID_jurnal)" 
                        class="btn btn-sm btn-outline-danger">
                  Delete
                </button>
              </div>
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

const token = getToken();
const headers = { Authorization: `Bearer ${token}` };

const journals = ref([]);
const stats = ref({ draft: 0, pending_review: 0, published: 0, rejected: 0 });

const getStatusColor = (status) => {
  const colors = {
    'draft': 'secondary',
    'pending_review': 'warning',
    'under_revision': 'info',
    'published': 'success',
    'rejected': 'danger',
    'revision_needed': 'warning'
  };
  return colors[status] || 'secondary';
};

const deleteJournal = async (id) => {
  if (!confirm('Are you sure you want to delete this journal?')) return;

  try {
    await axios.delete(`http://localhost:3000/api/author/journals/${id}`, { headers });
    alert('Journal deleted successfully!');
    loadJournals();
  } catch (error) {
    alert('Error: ' + error.response?.data?.message || error.message);
  }
};

const loadJournals = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/author/journals', { headers });
    journals.value = res.data.data;

    stats.value = {
      draft: journals.value.filter(j => j.status === 'draft').length,
      pending_review: journals.value.filter(j => j.status === 'pending_review').length,
      published: journals.value.filter(j => j.status === 'published').length,
      rejected: journals.value.filter(j => j.status === 'rejected').length
    };
  } catch (error) {
    console.error('Error loading journals:', error);
  }
};

onMounted(() => {
  loadJournals();
});
</script>

<style scoped>
.my-journals-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.stat-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #007bff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin: 0;
}

.journal-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
}

.journal-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 8px rgba(0,123,255,0.1);
}
</style>
