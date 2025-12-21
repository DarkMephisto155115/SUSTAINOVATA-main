<template>
  <div class="journal-form-page">
    <div class="container py-4">
      <router-link to="/author/journals" class="btn btn-secondary mb-3">
        ← Back to My Journals
      </router-link>

      <div class="card">
        <div class="card-body">
          <h2 class="card-title mb-4">{{ isEditMode ? 'Edit Journal' : 'Create New Journal' }}</h2>

          <form @submit.prevent="submitJournal">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Title *</label>
                  <input v-model="form.title" type="text" class="form-control" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">Writer *</label>
                  <input v-model="form.writer" type="text" class="form-control" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">Keywords</label>
                  <input v-model="form.keyword" type="text" class="form-control" placeholder="Separate with comma">
                </div>

                <div class="mb-3">
                  <label class="form-label">DOI</label>
                  <input v-model="form.doi" type="text" class="form-control">
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Cover Image</label>
                  <input type="file" accept="image/*" @change="onCoverSelected" class="form-control">
                  <div v-if="form.coverPreview" class="mt-2">
                    <img :src="form.coverPreview" alt="Cover preview" style="max-width: 150px;" class="img-thumbnail">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Document PDF *</label>
                  <input type="file" accept=".pdf" @change="onFileSelected" :required="!isEditMode" class="form-control">
                  <small class="text-muted">Max 10MB</small>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Abstract *</label>
              <textarea v-model="form.abstract" class="form-control" rows="5" required 
                        placeholder="Write a concise summary of your journal..."></textarea>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
              </button>
              <button v-if="!isEditMode" @click="submitAndReview" type="button" class="btn btn-success" :disabled="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Create & Submit for Review' }}
              </button>
              <router-link to="/author/journals" class="btn btn-secondary">
                Cancel
              </router-link>
            </div>
          </form>
        </div>
      </div>

      <!-- Current Journal Document Viewer -->
      <div v-if="isEditMode && journal && journal.file" class="card mt-4">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0">📄 Current Document</h5>
        </div>
        <div class="card-body">
          <div class="d-flex gap-2 mb-3">
            <button @click="togglePdfViewer" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-eye"></i> {{ showPdfViewer ? 'Hide PDF' : 'View PDF' }}
            </button>
            <a
              v-if="pdfUrl"
              :href="pdfUrl"
              download
              class="btn btn-sm btn-outline-secondary"
            >
              <i class="bi bi-download"></i> Download PDF
            </a>
          </div>

          <!-- PDF Viewer -->
          <div v-if="showPdfViewer && pdfUrl" class="pdf-viewer-container">
            <iframe
              :src="pdfUrl"
              class="pdf-embed"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>

      <div v-if="isEditMode && journal && (journal.status === 'revision_needed' || journal.status === 'under_revision')" class="card mt-4">
        <div class="card-header bg-warning">
          <h5 class="mb-0">📝 Upload Revision</h5>
        </div>
        <div class="card-body">
          <div class="alert alert-info mb-3">
            <strong>Status:</strong> <span :class="`badge bg-${getStatusColor(journal.status)}`">{{ formatStatus(journal.status) }}</span>
            <p class="mb-0 mt-2">Your journal needs revision. Please upload an updated version below.</p>
          </div>
          <form @submit.prevent="uploadRevision">
            <div class="mb-3">
              <label class="form-label">Upload Revised Document (PDF) *</label>
              <input type="file" accept=".pdf" @change="onRevisionSelected" class="form-control" required>
              <small class="text-muted">Max 10MB</small>
            </div>
            <div class="mb-3">
              <label class="form-label">Revision Notes</label>
              <textarea v-model="revisionNotes" class="form-control" rows="3" placeholder="Describe what changes you made..."></textarea>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-warning" :disabled="isSubmitting">
                {{ isSubmitting ? 'Uploading...' : '✓ Submit Revision' }}
              </button>
              <button type="button" @click="cancelRevision" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { getToken } from '@/utils/auth';

const route = useRoute();
const router = useRouter();
const token = getToken();
const headers = { Authorization: `Bearer ${token}` };

const isEditMode = ref(!!route.params.id);
const isSubmitting = ref(false);
const journal = ref(null);
const selectedFile = ref(null);
const selectedCover = ref(null);
const selectedRevision = ref(null);
const revisionNotes = ref('');
const showPdfViewer = ref(false);

const pdfUrl = computed(() => {
  if (!journal.value?.file) return null;
  return `http://localhost:3000/api/images/jurnal/pdf/${encodeURIComponent(journal.value.file)}`;
});

const togglePdfViewer = () => {
  showPdfViewer.value = !showPdfViewer.value;
};

const form = ref({
  title: '',
  writer: '',
  keyword: '',
  abstract: '',
  doi: '',
  coverPreview: null
});

const getStatusColor = (status) => {
  const colors = {
    'draft': 'secondary',
    'pending_review': 'warning',
    'under_revision': 'info',
    'revision_needed': 'warning',
    'published': 'success',
    'rejected': 'danger'
  };
  return colors[status] || 'secondary';
};

const formatStatus = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'pending_review': 'Pending Review',
    'under_revision': 'Under Revision',
    'revision_needed': 'Revision Needed',
    'published': 'Published',
    'rejected': 'Rejected'
  };
  return statusMap[status] || status;
};

const onCoverSelected = (event) => {
  selectedCover.value = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.coverPreview = e.target.result;
  };
  reader.readAsDataURL(selectedCover.value);
};

const onFileSelected = (event) => {
  selectedFile.value = event.target.files[0];
};

const onRevisionSelected = (event) => {
  selectedRevision.value = event.target.files[0];
};

const submitJournal = async () => {
  if (!form.value.title || !form.value.writer || !form.value.abstract) {
    alert('Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('title', form.value.title);
  formData.append('writer', form.value.writer);
  formData.append('keyword', form.value.keyword);
  formData.append('abstract', form.value.abstract);
  formData.append('doi', form.value.doi);

  if (selectedCover.value) formData.append('cover_image', selectedCover.value);
  if (selectedFile.value) formData.append('file', selectedFile.value);

  try {
    if (isEditMode.value) {
      await axios.put(`http://localhost:3000/api/author/journals/${route.params.id}`, 
        { title: form.value.title, writer: form.value.writer, keyword: form.value.keyword, 
          abstract: form.value.abstract, doi: form.value.doi },
        { headers }
      );
    } else {
      await axios.post('http://localhost:3000/api/author/journals', formData, { 
        headers
      });
    }
    alert('Journal saved successfully!');
    router.push('/author/journals');
  } catch (error) {
    alert('Error: ' + error.response?.data?.message || error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const submitAndReview = async () => {
  if (!selectedFile.value) {
    alert('Please upload a PDF file');
    return;
  }

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('title', form.value.title);
  formData.append('writer', form.value.writer);
  formData.append('keyword', form.value.keyword);
  formData.append('abstract', form.value.abstract);
  formData.append('doi', form.value.doi);
  formData.append('file', selectedFile.value);
  if (selectedCover.value) formData.append('cover_image', selectedCover.value);

  try {
    const res = await axios.post('http://localhost:3000/api/author/journals', formData, { 
      headers
    });
    const journalId = res.data.data.ID_jurnal;
    
    await axios.post(`http://localhost:3000/api/author/journals/${journalId}/submit-review`, {}, { headers });
    alert('Journal created and submitted for review!');
    router.push('/author/journals');
  } catch (error) {
    alert('Error: ' + error.response?.data?.message || error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const uploadRevision = async () => {
  if (!selectedRevision.value) {
    alert('Please select a file');
    return;
  }

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('file', selectedRevision.value);
  formData.append('revision_notes', revisionNotes.value);

  try {
    await axios.post(`http://localhost:3000/api/author/journals/${route.params.id}/upload-revision`, formData, { 
      headers
    });
    alert('Revision uploaded successfully!');
    selectedRevision.value = null;
    revisionNotes.value = '';
    window.location.reload();
  } catch (error) {
    alert('Error: ' + error.response?.data?.message || error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const cancelRevision = () => {
  selectedRevision.value = null;
  revisionNotes.value = '';
};

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const res = await axios.get(`http://localhost:3000/api/author/journals/${route.params.id}`, { headers });
      journal.value = res.data.data;
      form.value = {
        title: journal.value.title,
        writer: journal.value.writer,
        keyword: journal.value.keyword,
        abstract: journal.value.abstract,
        doi: journal.value.doi,
        coverPreview: `http://localhost:3000/api/images/${journal.value.cover_image}`
      };
    } catch (error) {
      alert('Error loading journal: ' + error.response?.data?.message || error.message);
    }
  }
});
</script>

<style scoped>
.journal-form-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

textarea.form-control {
  resize: vertical;
}

.pdf-viewer-container {
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.pdf-embed {
  width: 100%;
  height: 600px;
  display: block;
}
</style>
