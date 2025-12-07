<template>
  <div class="admin-content">
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-body">
          <h1 class="mb-3">Tambah Publikasi Baru</h1>
          <p class="text-muted mb-4">Isi Formulir</p>

          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="judulPublikasi" class="form-label">Judul Publikasi</label>
              <input type="text" class="form-control" id="judulPublikasi" v-model="formData.title" required>
            </div>

            <div class="mb-3">
              <label for="penulis" class="form-label">Penulis</label>
              <input type="text" class="form-control" id="penulis" v-model="formData.writer" required>
            </div>

            <div class="mb-3">
              <label for="abstrak" class="form-label">Abstrak</label>
              <textarea class="form-control" id="abstrak" rows="4" v-model="formData.abstract" required></textarea>
            </div>

            <div class="mb-3">
              <label for="doi" class="form-label">DOI</label>
              <input type="text" class="form-control" id="doi" v-model="formData.doi">
            </div>

            <div class="mb-3">
              <label for="tanggalPublikasi" class="form-label">Tanggal Publikasi</label>
              <input type="date" class="form-control" id="tanggalPublikasi" v-model="formData.date_published" required>
            </div>

            <div class="mb-3">
              <label for="coverPublikasi" class="form-label">Cover Publikasi</label>
              <input type="file" class="form-control" id="coverPublikasi" accept="image/*" @change="handleCoverUpload">
              <div class="form-text">Format yang didukung: JPG, PNG, GIF, WebP (Maksimal 5MB)</div>

              <div v-if="coverPreview" class="mt-3">
                <label class="form-label">Preview Cover:</label>
                <div class="cover-preview">
                  <img :src="coverPreview" alt="Cover Preview" class="img-thumbnail">
                  <button type="button" class="btn btn-sm btn-danger ms-2" @click="removeCover">
                    Hapus Cover
                  </button>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="filePdf" class="form-label">File PDF</label>
              <input type="file" class="form-control" id="filePdf" accept=".pdf" @change="handleFileUpload" required>
              <div class="form-text">Format: PDF (Maksimal 10MB)</div>
            </div>

            <div class="mb-3">
              <label for="kataKunci" class="form-label">Kata Kunci</label>
              <input type="text" class="form-control" id="kataKunci" v-model="formData.keyword"
                placeholder="Pisahkan dengan koma" required>
            </div>

            <button type="submit" class="btn btn-simpan" :disabled="isSubmitting">
              <span v-if="isSubmitting">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Mengunggah...
              </span>
              <span v-else>Simpan Publikasi</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const formData = ref({
  title: '',
  writer: '',
  abstract: '',
  doi: '',
  date_published: '',
  keyword: '',
  cover_image: null,
  file: null
});

const coverPreview = ref(null);
const isSubmitting = ref(false);

const handleCoverUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file cover terlalu besar. Maksimal 5MB.');
      event.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.');
      event.target.value = '';
      return;
    }

    formData.value.cover_image = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      coverPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file PDF terlalu besar. Maksimal 10MB.');
      event.target.value = '';
      return;
    }

    if (file.type !== 'application/pdf') {
      alert('Format file harus PDF.');
      event.target.value = '';
      return;
    }

    formData.value.file = file;
  }
};

const removeCover = () => {
  formData.value.cover_image = null;
  coverPreview.value = null;
  document.getElementById('coverPublikasi').value = '';
};

const submitForm = async () => {
  if (!formData.value.title.trim()) {
    alert('Judul publikasi harus diisi.');
    return;
  }

  if (!formData.value.file) {
    alert('File PDF wajib diunggah.');
    return;
  }

  try {
    isSubmitting.value = true;

    const formDataToSend = new FormData();
    Object.keys(formData.value).forEach(key => {
      if (formData.value[key] !== null) {
        formDataToSend.append(key, formData.value[key]);
      }
    });

    const response = await axios.post(
      'http://localhost:3000/api/uploads/tambah/jurnal',
      formDataToSend
    );

    if (response.status === 200) {
      alert('Publikasi berhasil ditambahkan!');
      resetForm();
      router.push('/admin/kelola/publikasi');
    } else {
      throw new Error(response.data.message || 'Gagal menambahkan publikasi');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert(`Terjadi kesalahan: `);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    title: '',
    writer: '',
    abstract: '',
    doi: '',
    date_published: '',
    keyword: '',
    cover_image: null,
    file: null
  };
  coverPreview.value = null;
  document.getElementById('coverPublikasi').value = '';
  document.getElementById('filePdf').value = '';
};
</script>


<style scoped>
.admin-content {
  margin-left: 225px;
  margin-top: 70px;
  padding: 20px;
}

.card {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
}

.form-control {
  border-radius: 4px;
  border: 1px solid #ced4da;
  padding: 8px 12px;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-simpan {
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
}

.btn-simpan:hover {
  background-color: #333;
}

.btn-simpan:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.cover-preview {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cover-preview img {
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}
</style>