<template>
  <div class="admin-content">
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-body">
          <h1 class="mb-3">Tambah Program Baru</h1>
          <p class="text-muted mb-4">Isi Formulir</p>
          
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="namaProgram" class="form-label">Nama Program</label>
              <input 
                type="text" 
                class="form-control" 
                id="namaProgram" 
                v-model="formData.name"
                required
              >
            </div>
            
            <div class="mb-3">
              <label for="deskripsi" class="form-label">Deskripsi</label>
              <textarea 
                class="form-control" 
                id="deskripsi" 
                rows="3"
                v-model="formData.description"
              ></textarea>
            </div>
            
            <!-- Poster Program Field -->
            <div class="mb-3">
              <label for="poster" class="form-label">Poster Program</label>
              <input 
                type="file" 
                class="form-control" 
                id="poster" 
                accept="image/*"
                @change="handlePosterUpload"
              >
              <div class="form-text">Format yang didukung: JPG, PNG, GIF, WebP (Maksimal 5MB)</div>
              
              <!-- Preview Poster -->
              <div v-if="posterPreview" class="mt-3">
                <label class="form-label">Preview Poster:</label>
                <div class="poster-preview">
                  <img :src="posterPreview" alt="Poster Preview" class="img-thumbnail">
                  <button 
                    type="button" 
                    class="btn btn-sm btn-danger ms-2" 
                    @click="removePoster"
                  >
                    Hapus Poster
                  </button>
                </div>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="status" class="form-label">Status</label>
                <select 
                  class="form-control" 
                  id="status" 
                  v-model="formData.status"
                >
                  <option value="">Pilih Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Ditunda">Ditunda</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="peserta" class="form-label">Jumlah Peserta</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="jumlahPeserta" 
                  v-model="formData.peserta"
                  min="0"
                >
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="tanggalMulai" class="form-label">Tanggal Mulai</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="tanggalMulai" 
                  v-model="formData.start_date"
                >
              </div>
              <div class="col-md-6">
                <label for="tanggalSelesai" class="form-label">Tanggal Selesai</label>
                <input 
                  type="date" 
                  class="form-control" 
                  id="tanggalSelesai" 
                  v-model="formData.end_date"
                >
              </div>
            </div>
            
            <button type="submit" class="btn btn-simpan" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Program' }}
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
  name: '',
  description: '',
  poster: null,
  status: '',
  peserta: 0,
  start_date: '',
  end_date: ''
});

const posterPreview = ref(null);
const isSubmitting = ref(false);

// Methods
const handlePosterUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validasi ukuran file (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file poster terlalu besar. Maksimal 5MB.');
      event.target.value = '';
      return;
    }
    
    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.');
      event.target.value = '';
      return;
    }
    
    formData.value.poster = file;
    
    // Buat preview
    const reader = new FileReader();
    reader.onload = (e) => {
      posterPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removePoster = () => {
  formData.value.poster = null;
  posterPreview.value = null;
  // Reset input file
  document.getElementById('poster').value = '';
};

const submitForm = async () => {
  // Validasi form
  if (!formData.value.name.trim()) {
    alert('Nama program harus diisi.');
    return;
  }
  
  if (formData.value.start_date && formData.value.end_date) {
    if (new Date(formData.value.start_date) > new Date(formData.value.end_date)) {
      alert('Tanggal mulai tidak boleh lebih besar dari tanggal selesai.');
      return;
    }
  }
  
  try {
    const formDataToSend = new FormData();
    Object.keys(formData.value).forEach(key => {
      if (formData.value[key] !== null && formData.value[key] !== '') {
        formDataToSend.append(key, formData.value[key]);
      }
    });
    
    for (let pair of formDataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    isSubmitting.value = true;

    const response = await axios.post('http://localhost:3000/api/uploads/tambah/program', formDataToSend);
    console.log('Response:', response.data);
    if (response.status === 200) {
      alert('Program berhasil disimpan!');
      console.log('Program berhasil disimpan:', response.data);
    } else {
      alert('Gagal menyimpan program: ');
      console.error(response.data.message);
      return;
    }
    // Reset form after submission
    resetForm();
    
    // Redirect back to program list
    router.push('/admin/kelola/program');
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Terjadi kesalahan saat menyimpan program');
    isSubmitting.value = false;
  }
  finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    name: '',
    deskripsi: '',
    poster: null,
    status: '',
    peserta: 0,
    start_date: '',
    end_date: ''
  };
  posterPreview.value = null;
  
  // Reset file input
  document.getElementById('poster').value = '';
};
</script>

<style scoped>
.admin-content {
  margin-left: 225px; /* Same as sidebar width */
  margin-top: 70px; /* Same as header height */
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

.poster-preview {
  display: flex;
  align-items: center;
  gap: 10px;
}

.poster-preview img {
  max-width: 250px;
  max-height: 200px;
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