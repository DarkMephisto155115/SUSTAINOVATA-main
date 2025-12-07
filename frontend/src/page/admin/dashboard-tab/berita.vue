<template>
  <div class="admin-content">
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-body">
          <h1 class="mb-3">Tambah Berita Baru</h1>
          <p class="text-muted mb-4">Isi Formulir</p>

          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="judulBerita" class="form-label">Judul Berita</label>
              <input type="text" class="form-control" id="judulBerita" v-model="formData.title" required>
            </div>

            <div class="mb-3">
              <label for="kategori" class="form-label">Kategori</label>
              <input type="text" class="form-control" id="kategori" v-model="formData.kategori">
            </div>

            <div class="mb-3">
              <label for="ringkasan" class="form-label">Ringkasan</label>
              <textarea class="form-control" id="ringkasan" rows="3" v-model="formData.ringkasan"></textarea>
            </div>

            <div class="mb-3">
              <label for="kontenBerita" class="form-label">Konten Berita</label>
              <textarea class="form-control" id="kontenBerita" rows="6" v-model="formData.text"></textarea>
            </div>

            <div class="mb-3">
              <label for="coverPublikasi" class="form-label">Cover Publikasi</label>
              <input type="file" class="form-control" id="coverBerita" accept="image/*" @change="handleCoverUpload" ref="coverInputRef">
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
              <label for="tanggalPublikasi" class="form-label">Tanggal Publikasi</label>
              <input type="date" class="form-control" id="tanggalPublikasi" v-model="formData.date_published">
            </div>

            <button type="submit" class="btn btn-simpan" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Berita' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  title: '',
  kategori: '',
  ringkasan: '',
  text: '',
  cover_image: null,
  date_published: ''
});

const coverPreview = ref(null);
const isSubmitting = ref(false);
const coverInputRef = ref(null);

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

const removeCover = () => {
  formData.value.cover_image = null;
  coverPreview.value = null;
  if (coverInputRef.value) coverInputRef.value.value = '';
};

const submitForm = async () => {
  const { title, text } = formData.value;
  if (title.trim().length < 5 || text.trim().length < 10) {
    alert('Judul minimal 5 karakter dan konten minimal 10 karakter.');
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

    // Debugging isi FormData
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await axios.post(
      'http://localhost:3000/api/uploads/tambah/berita',
      formDataToSend
    );

    if (response.status === 200) {
      console.log('Berita berhasil disimpan:', response.data);
      alert('Berita berhasil disimpan!');
      resetForm();
      router.push('/admin/kelola/berita');
    } else {
      throw new Error('Gagal menyimpan berita.');
      
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert(`Terjadi kesalahan: ${error.response?.data?.message || error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    title: '',
    kategori: '',
    ringkasan: '',
    text: '',
    cover_image: null,
    date_published: ''
  };
  coverPreview.value = null;
  if (coverInputRef.value) coverInputRef.value.value = '';
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
</style>
