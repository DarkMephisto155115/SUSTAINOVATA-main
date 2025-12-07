<template>
  <div>
    <!-- Header Section -->
    <section class="header-section py-5">
      <div class="container py-4 text-center">
        <h1 class="display-4 fw-bold mb-3">Kontak <span class="text-success">Kami</span></h1>
        <p class="lead mx-auto" style="max-width: 700px;">
          Kami senang mendengar dari Anda. Hubungi kami untuk pertanyaan, kolaborasi, atau informasi lebih lanjut tentang program dan inisiatif Sustainovata.
        </p>
      </div>
    </section>
    
    <!-- Contact Information and Form Section -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <!-- Left Column - Contact Information -->
          <div class="col-lg-5">
            <!-- Address Card -->
            <div class="card mb-4 border-0 shadow-sm bg-light bg-opacity-50">
              <div class="card-body p-4">
                <h3 class="mb-4">Informasi Kontak</h3>
                
                <div class="d-flex mb-4">
                  <div class="bg-success rounded-circle p-2 d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-geo-alt-fill text-white"></i>
                  </div>
                  <div>
                    <h5 class="mb-1">Alamat</h5>
                    <p class="mb-0">
                      Jln. Mawar No. 32<br>
                      Kec. Lowokwaru<br>
                      Kota Malang<br>
                      10809
                    </p>
                  </div>
                </div>
                
                <div class="d-flex mb-4">
                  <div class="bg-success rounded-circle p-2 d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-telephone-fill text-white"></i>
                  </div>
                  <div>
                    <h5 class="mb-1">Telepon</h5>
                    <p class="mb-0">08191919910</p>
                  </div>
                </div>
                
                <div class="d-flex mb-4">
                  <div class="bg-success rounded-circle p-2 d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="bi bi-envelope-fill text-white"></i>
                  </div>
                  <div>
                    <h5 class="mb-1">Email</h5>
                    <p class="mb-0">info@sustainovata.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Social Media Card -->
            <div class="card border-0 shadow-sm bg-light bg-opacity-50">
              <div class="card-body p-4">
                <h3 class="mb-3">Ikuti Kami</h3>
                <p class="mb-4">Dapatkan informasi terbaru tentang program dan inisiatif kami melalui media sosial.</p>
                
                <div class="d-flex gap-3">
                  <a href="#" class="text-decoration-none">
                    <div class="bg-danger rounded p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                      <i class="bi bi-youtube text-white"></i>
                    </div>
                  </a>
                  <a href="#" class="text-decoration-none">
                    <div class="bg-primary rounded p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                      <i class="bi bi-facebook text-white"></i>
                    </div>
                  </a>
                  <a href="#" class="text-decoration-none">
                    <div class="bg-danger bg-opacity-75 rounded p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                      <i class="bi bi-instagram text-white"></i>
                    </div>
                  </a>
                  <a href="#" class="text-decoration-none">
                    <div class="bg-success rounded p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                      <i class="bi bi-threads text-white"></i>
                    </div>
                  </a>
                  <a href="#" class="text-decoration-none">
                    <div class="bg-dark rounded p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                      <i class="bi bi-twitter-x text-white"></i>
                    </div>
                  </a>
                  <a href="#" class="text-decoration-none">
                    <div class="bg-dark bg-opacity-75 rounded p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                      <i class="bi bi-tiktok text-white"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Column - Contact Form -->
          <div class="col-lg-7">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="mb-4">Kirim Pesan</h3>
                
                <form @submit.prevent="submitForm">
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <label for="name" class="form-label">Nama</label>
                      <input type="text" class="form-control" id="name" placeholder="Nama Lengkap" v-model="formData.name" required>
                    </div>
                    <div class="col-md-6">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" placeholder="nama@email.com" v-model="formData.email" required>
                    </div>
                  </div>
                  
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <label for="subject" class="form-label">Subjek</label>
                      <input type="text" class="form-control" id="subject" placeholder="Subjek" v-model="formData.subject" required>
                    </div>
                    <div class="col-md-6">
                      <label for="topic" class="form-label">Topik</label>
                      <select class="form-select" id="topic" v-model="formData.topic" required>
                        <option value="" disabled selected>Pilih Topik</option>
                        <option value="pertanyaan">Pertanyaan Umum</option>
                        <option value="kolaborasi">Kolaborasi</option>
                        <option value="program">Informasi Program</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="message" class="form-label">Pesan</label>
                    <textarea class="form-control" id="message" rows="5" placeholder="Tulis pesan Anda di sini..." v-model="formData.message" required></textarea>
                  </div>
                  
                  <div class="mb-4">
                    <label for="attachment" class="form-label">Lampiran Pesan (Opsional)</label>
                    <div class="input-group mb-1">
                      <input type="file" class="form-control" id="attachment" @change="handleFileChange">
                    </div>
                    <small class="text-muted">Unggah dokumen atau gambar yang relevan dengan pesan Anda (opsional).</small>
                    <div class="mt-2 small text-muted">
                      Klik untuk unggah atau seret dan lepas<br>
                      PDF, DOC, atau DOCX (Maks. 5MB)
                    </div>
                  </div>
                  
                  <button type="submit" class="btn btn-success w-100 py-2">Kirim Pesan</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const formData = ref({
      name: '',
      email: '',
      subject: '',
      topic: '',
      message: '',
      attachment: null
    });

    const handleFileChange = (event) => {
      formData.value.attachment = event.target.files[0];
    };

    const submitForm = async () => {
      try {
        const formDataObj = new FormData();
        formDataObj.append('name', formData.value.name);
        formDataObj.append('email', formData.value.email);
        formDataObj.append('subject', formData.value.subject);
        formDataObj.append('topic', formData.value.topic);
        formDataObj.append('message', formData.value.message);
        if (formData.value.attachment) {
          formDataObj.append('attachment', formData.value.attachment);
        }

        const response = await axios.post('http://localhost:3000/api/clients/contact', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.success) {
          alert('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
          formData.value = {
            name: '',
            email: '',
            subject: '',
            topic: '',
            message: '',
            attachment: null
          };
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Terjadi kesalahan: ' + (error.response?.data?.message || error.message));
      }
    };

    return {
      formData,
      handleFileChange,
      submitForm
    };
  }
};
</script>


<style scoped>
.header-section {
  background-color: #f9e94e;
}

.form-control:focus, .form-select:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}
</style>