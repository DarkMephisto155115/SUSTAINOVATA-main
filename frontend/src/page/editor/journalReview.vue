<template>
  <div class="journal-review-page">
    <div class="container py-4">
      <router-link to="/editor/dashboard" class="btn btn-secondary mb-3">
        ← Back to Dashboard
      </router-link>

      <div v-if="journal" class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-body">
              <h2 class="card-title">{{ journal.title }}</h2>
              <p class="text-muted">By: {{ journal.author_name }}</p>
              
              <div class="journal-details">
                <p><strong>Keywords:</strong> {{ journal.keyword }}</p>
                <p><strong>DOI:</strong> {{ journal.doi }}</p>
                <p><strong>Abstract:</strong></p>
                <p class="abstract-text">{{ journal.abstract }}</p>

                <div class="file-section mt-3">
                  <p><strong>Document:</strong></p>
                  <a v-if="journal.file" :href="`http://localhost:3000/api/uploads/${journal.file}`" target="_blank" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-download"></i> Download PDF
                  </a>
                </div>

                <div v-if="journal.cover_image" class="cover-image mt-3">
                  <img :src="`http://localhost:3000/api/images/${journal.cover_image}`" alt="Cover" style="max-width: 300px;" class="img-thumbnail">
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Review History</h5>
            </div>
            <div class="card-body">
              <div v-if="reviews.length === 0" class="alert alert-info">
                No reviews yet
              </div>
              <div v-for="review in reviews" :key="review.ID_review" class="review-item mb-3 p-3 border rounded">
                <p class="mb-1"><strong>Status:</strong> <span :class="`badge bg-${getStatusColor(review.status)}`">{{ review.status }}</span></p>
                <p class="mb-1"><strong>Feedback:</strong> {{ review.feedback || 'No feedback' }}</p>
                <p class="mb-0"><strong>Revision Notes:</strong> {{ review.revision_notes || 'None' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Provide Review</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitReview">
                <div class="mb-3">
                  <label class="form-label">Decision</label>
                  <select v-model="reviewForm.status" class="form-control" required>
                    <option value="">Select decision</option>
                    <option value="approved">Approve</option>
                    <option value="revision">Request Revision</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Feedback</label>
                  <textarea v-model="reviewForm.feedback" class="form-control" rows="4" placeholder="Provide feedback to the author"></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label">Revision Notes</label>
                  <textarea v-model="reviewForm.revision_notes" class="form-control" rows="3" placeholder="Specific revision requirements"></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
                  <span v-if="isSubmitting">Submitting...</span>
                  <span v-else>Submit Review</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="alert alert-warning">
        Loading journal details...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { getToken } from '@/utils/auth';

const route = useRoute();
const router = useRouter();
const token = getToken();
const headers = { Authorization: `Bearer ${token}` };

const journal = ref(null);
const reviews = ref([]);
const isSubmitting = ref(false);
const reviewForm = ref({
  status: '',
  feedback: '',
  revision_notes: ''
});

const getStatusColor = (status) => {
  const colors = {
    'approved': 'success',
    'revision': 'warning',
    'rejected': 'danger',
    'pending': 'secondary'
  };
  return colors[status] || 'secondary';
};

const submitReview = async () => {
  if (!reviewForm.value.status) {
    alert('Please select a decision');
    return;
  }

  isSubmitting.value = true;
  try {
    await axios.post(`http://localhost:3000/api/editor/journals/${route.params.id}/review`, {
      ID_jurnal: route.params.id,
      FK_ID_author: journal.value.FK_ID_user,
      status: reviewForm.value.status,
      feedback: reviewForm.value.feedback,
      revision_notes: reviewForm.value.revision_notes
    }, { headers });

    alert('Review submitted successfully!');
    router.push('/editor/dashboard');
  } catch (error) {
    alert('Error submitting review: ' + error.response?.data?.message || error.message);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/editor/journals/${route.params.id}`, { headers });
    journal.value = res.data.data;
    reviews.value = res.data.reviews;
  } catch (error) {
    alert('Error loading journal: ' + error.response?.data?.message || error.message);
  }
});
</script>

<style scoped>
.journal-review-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.journal-details {
  background-color: #f0f7ff;
  padding: 15px;
  border-radius: 5px;
}

.abstract-text {
  line-height: 1.6;
  font-size: 0.95rem;
}

.review-item {
  background-color: #fff;
}
</style>
