<template>
  <div>
    <!-- Header Section -->
    <section class="header-section py-5">
      <div class="container py-4 text-center">
        <h1 class="display-4 fw-bold mb-3">Ajukan <span class="text-success">Kolaborasi</span></h1>
        <p class="lead mx-auto" style="max-width: 700px;">
          Bergabunglah dengan Sustainovata untuk bersama-sama menciptakan solusi berkelanjutan yang berdampak.
        </p>
      </div>
    </section>

    <!-- Collaboration Form Section -->
    <section class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-5">
                <form @submit.prevent="submitCollaborationForm">
                    <div class="row g-3 mb-4">
                      <div class="col-md-6">
                        <label class="form-label fw-bold">Nama Organisasi</label>
                        <input v-model="formData.organizationName" type="text" class="form-control" placeholder="Nama organisasi/institusi Anda" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold">Jenis Organisasi</label>
                        <select v-model="formData.organizationType" class="form-select" required>
                          <option value="">Pilih jenis organisasi</option>
                          <option value="university">Universitas</option>
                          <option value="research">Lembaga Penelitian</option>
                          <option value="ngo">LSM/NGO</option>
                          <option value="government">Pemerintah</option>
                          <option value="company">Perusahaan</option>
                          <option value="community">Komunitas</option>
                          <option value="other">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div class="row g-3 mb-4">
                      <div class="col-md-6">
                        <label class="form-label fw-bold">Nama Kontak</label>
                        <input v-model="formData.contactName" type="text" class="form-control" placeholder="Nama lengkap" required>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold">Email</label>
                        <input v-model="formData.contactEmail" type="email" class="form-control" placeholder="email@organisasi.com" required>
                      </div>
                    </div>

                    <div class="row g-3 mb-4">
                      <div class="col-md-6">
                        <label class="form-label fw-bold">Telepon</label>
                        <input v-model="formData.contactPhone" type="tel" class="form-control" placeholder="+62-">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-bold">Alamat Organisasi</label>
                        <input v-model="formData.organizationAddress" type="text" class="form-control" placeholder="Alamat lengkap">
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="form-label fw-bold">Jenis Kolaborasi</label>
                      <div class="form-check">
                        <input v-model="formData.collaborationType" class="form-check-input" type="radio" name="collab" value="research" id="collab1">
                        <label class="form-check-label" for="collab1">
                          Penelitian Bersama
                        </label>
                      </div>
                      <div class="form-check">
                        <input v-model="formData.collaborationType" class="form-check-input" type="radio" name="collab" value="community" id="collab2">
                        <label class="form-check-label" for="collab2">
                          Pemberdayaan Masyarakat
                        </label>
                      </div>
                      <div class="form-check">
                        <input v-model="formData.collaborationType" class="form-check-input" type="radio" name="collab" value="technology" id="collab3">
                        <label class="form-check-label" for="collab3">
                          Transfer Teknologi
                        </label>
                      </div>
                      <div class="form-check">
                        <input v-model="formData.collaborationType" class="form-check-input" type="radio" name="collab" value="other" id="collab4">
                        <label class="form-check-label" for="collab4">
                          Lainnya
                        </label>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="form-label fw-bold">Deskripsi Kolaborasi</label>
                      <textarea v-model="formData.description" class="form-control" rows="5" placeholder="Jelaskan rencana kolaborasi, tujuan, dan area fokus..." required></textarea>
                    </div>

                    <div class="d-grid gap-2 d-md-flex">
                      <button type="submit" class="btn btn-success btn-lg" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Mengirim...' : 'Ajukan Kolaborasi' }}
                      </button>
                      <router-link to="/kemitraan" class="btn btn-outline-secondary btn-lg">
                        Kembali
                      </router-link>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSubmitting = ref(false);

const formData = ref({
  organizationName: '',
  organizationType: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  organizationAddress: '',
  collaborationType: 'research',
  description: ''
});

const submitCollaborationForm = async () => {
  try {
    isSubmitting.value = true;
    const response = await axios.post('http://localhost:3000/api/clients/collaboration-request', formData.value);

    if (response.data.success) {
      alert('Permintaan kolaborasi berhasil dikirim! Kami akan segera menghubungi Anda.');
      router.push('/kemitraan');
    }
  } catch (error) {
    console.error('Error submitting collaboration request:', error);
    alert('Terjadi kesalahan: ' + (error.response?.data?.message || error.message));
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.header-section {
  background-color: #f9e94e;
}

.form-check {
  padding-left: 1.75rem;
  margin-bottom: 0.75rem;
}

.form-check-input {
  margin-left: -1.75rem;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
