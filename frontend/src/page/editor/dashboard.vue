<template>
  <div class="editor-dashboard">
    <div class="container py-5">
      <h1 class="mb-4">Editor Dashboard</h1>
      
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card stat-card">
            <div class="card-body">
              <h5 class="card-title">Pending Review</h5>
              <p class="stat-number">{{ stats.pendingReview }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card stat-card">
            <div class="card-body">
              <h5 class="card-title">Approved</h5>
              <p class="stat-number">{{ stats.approved }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card stat-card">
            <div class="card-body">
              <h5 class="card-title">Needs Revision</h5>
              <p class="stat-number">{{ stats.needsRevision }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card stat-card">
            <div class="card-body">
              <h5 class="card-title">Unread Messages</h5>
              <p class="stat-number">{{ unreadMessagesCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Pending Journals for Review</h5>
            </div>
            <div class="card-body">
              <div v-if="journals.length === 0" class="alert alert-info">
                No journals pending review
              </div>
              <div v-for="journal in journals" :key="journal.ID_jurnal" class="journal-item mb-3">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ journal.title }}</h6>
                    <p class="text-muted mb-1">By: {{ journal.author_name }}</p>
                    <p class="small">{{ journal.abstract.substring(0, 100) }}...</p>
                  </div>
                  <router-link :to="`/editor/journal/${journal.ID_jurnal}`" class="btn btn-sm btn-outline-primary">
                    Review
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="row g-3">
            <div class="col-12">
              <div class="card">
                <div class="card-header bg-success text-white">
                  <h5 class="mb-0">My Collaborations</h5>
                </div>
                <div class="card-body">
                  <div v-if="collaborations.length === 0" class="alert alert-info">
                    No active collaborations
                  </div>
                  <div v-for="collab in collaborations" :key="collab.ID_collab" class="collab-item mb-2">
                    <p class="mb-1">{{ collab.title }}</p>
                    <p class="small text-muted">{{ collab.member_count }} members</p>
                  </div>
                  <router-link to="/editor/collaborations" class="btn btn-sm btn-primary w-100 mt-3">
                    View All
                  </router-link>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="card">
                <div class="card-header bg-info text-white">
                  <h5 class="mb-0">Messages</h5>
                </div>
                <div class="card-body">
                  <div v-if="messages.length === 0" class="alert alert-info">
                    No messages
                  </div>
                  <div v-else>
                    <p class="small text-muted mb-3">{{ unreadMessagesCount }} unread message(s)</p>
                    <router-link to="/editor/messages" class="btn btn-sm btn-info w-100">
                      <i class="bi bi-envelope me-2"></i>View Messages
                    </router-link>
                  </div>
                </div>
              </div>
            </div>


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

const stats = ref({ pendingReview: 0, approved: 0, needsRevision: 0 });
const journals = ref([]);
const collaborations = ref([]);
const messages = ref([]);
const token = getToken();

const unreadMessagesCount = computed(() => {
  return messages.value.filter(m => m.status === 'new').length;
});

onMounted(async () => {
  try {
    const headers = { Authorization: `Bearer ${token}` };

    const statsRes = await axios.get('http://localhost:3000/api/editor/dashboard/stats', { headers });
    stats.value = statsRes.data.data;

    const journalsRes = await axios.get('http://localhost:3000/api/editor/journals/pending', { headers });
    journals.value = journalsRes.data.data;

    const collabRes = await axios.get('http://localhost:3000/api/editor/collaborations', { headers });
    collaborations.value = collabRes.data.data;

    const messagesRes = await axios.get('http://localhost:3000/api/admin/messages', { headers });
    messages.value = messagesRes.data.data || [];
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
});
</script>

<style scoped>
.editor-dashboard {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.stat-card {
  border-left: 4px solid #007bff;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin: 0;
}

.journal-item {
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #fff;
}

.journal-item:hover {
  border-color: #007bff;
  background-color: #f0f7ff;
}

.collab-item {
  padding: 10px;
  border-left: 3px solid #28a745;
  background-color: #f8f9fa;
  border-radius: 3px;
}
</style>
