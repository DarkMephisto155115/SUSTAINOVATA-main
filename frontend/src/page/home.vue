<template>
    <div>
        <!-- Hero Section -->
        <section class="hero-section position-relative" style="height: 90dvh;">
            <div class="overlay"></div>
            <div class="container position-relative">
                <div class="row min-vh-75 align-items-center py-5">
                    <div class="col-lg-7">
                        <h1 class="display-4 fw-bold text-white mb-4">Inovasi Berkelanjutan untuk Masa Depan yang Lebih
                            Baik</h1>
                        <p class="text-white mb-5">
                            Sustainovata adalah ekosistem inovasi berbasis STEAM yang berfokus pada riset, pemberdayaan
                            masyarakat, dan solusi berkelanjutan di bidang ekonomi hijau, ketahanan pangan, dan inovasi
                            sosial.
                        </p>
                        <div class="d-flex flex-wrap gap-3">
                            <router-link to="/join" class="btn btn-warning px-4 py-2 fw-medium">Bergabung bersama
                                Kami</router-link>
                            <router-link to="/learn-more" class="btn btn-outline-light px-4 py-2">Pelajari lebih
                                lanjut</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mission Section -->
        <section class="py-5">
            <div class="container text-center py-4">
                <h2 class="fw-bold mb-4 position-relative d-inline-block">
                    Misi Kami
                    <span class="position-absolute start-0 end-0 bottom-0 border-bottom border-2 border-warning"></span>
                </h2>
                <p class="lead mb-5 mx-auto" style="max-width: 800px;">
                    Sustainovata berkomitmen untuk menciptakan ekosistem inovasi yang mendorong solusi berkelanjutan
                    melalui pendekatan STEAM.
                </p>

                <div class="row g-4">
                    <!-- Feature Card 1 -->
                    <div class="col-md-4">
                        <div class="card h-100 bg-warning bg-opacity-75 text-center p-1">
                            <div class="card-body">
                                <div class="icon-wrapper mb-3 mx-auto">
                                    <i class="bi bi-lightbulb-fill fs-1"></i>
                                </div>
                                <h4 class="card-title mb-3">Inovasi Sosial</h4>
                                <p class="card-text">
                                    Menciptakan solusi kreatif dan berdampak untuk menjawab tantangan sosial melalui
                                    pendekatan berbasis teknologi dan empati.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Feature Card 2 -->
                    <div class="col-md-4">
                        <div class="card h-100 bg-warning bg-opacity-75 text-center p-1">
                            <div class="card-body">
                                <div class="icon-wrapper mb-3 mx-auto">
                                    <i class="bi bi-search fs-1"></i>
                                </div>
                                <h4 class="card-title mb-3">Riset Terpadu</h4>
                                <p class="card-text">
                                    Menggabungkan sains, teknologi, seni, dan matematika untuk menghasilkan riset yang
                                    aplikatif dan relevan terhadap isu nyata.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Feature Card 3 -->
                    <div class="col-md-4">
                        <div class="card h-100 bg-warning bg-opacity-75 text-center p-1">
                            <div class="card-body">
                                <div class="icon-wrapper mb-3 mx-auto">
                                    <i class="bi bi-people-fill fs-1"></i>
                                </div>
                                <h4 class="card-title mb-3">Kolaborasi Inklusif</h4>
                                <p class="card-text">
                                    Melibatkan berbagai pemangku kepentingan dan masyarakat lokal dalam setiap proses
                                    untuk memperkuat keberlanjutan dan kepemilikan bersama.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Programs Section -->
        <section class="py-3 bg-light">
            <div class="container text-center py-2">
                <h2 class="fw-bold mb-2 position-relative d-inline-block">
                    Program & Inovasi Unggulan
                    <span class="position-absolute start-0 end-0 bottom-0 border-bottom border-2 border-warning"></span>
                </h2>
                <p class="lead mb-5 mx-auto" style="max-width: 800px;">
                    Eksplorasi program inovasi berbasis STEAM kami yang berfokus pada solusi berkelanjutan untuk
                    tantangan global.
                </p>

                <div class="row g-5">
                    <ProgramCard
                    v-for="(program, index) in programs"
                    :key="index"
                    :title="program.name"
                    :description="program.description"
                    :image="getImages(program.poster)"
                    :link="`/programs/${program.ID_program}`"
                    />
                </div>
                <div class="mt-5">
                    <router-link to="/programs" class="btn btn-warning px-4 py-2">
                        see more <i class="bi bi-arrow-right"></i>
                    </router-link>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProgramCard from "./../components/cards/program-home.vue";

const programs = ref([]);

onMounted(() => {
    fetchProgram();
})

const getImages = (imageName) => {
  return `http://localhost:3000/api/images/programs/${encodeURIComponent(imageName)}`;
}

const fetchProgram = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/clients/home')
        // console.log(response.data)
        programs.value = response.data;
    } catch (error) {
        // console.error('Error fetching programs:', error);
        return programs.value = [];
    }
}

</script>

<style scoped>
.hero-section {
    background-image: url('../assets/image/bg-hero-section.png');
    background-size: cover;
    background-position: center;
    position: relative;
    color: white;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(271deg, rgba(242, 220, 43, 0.25) 0.54%, rgba(93, 128, 2, 0.80) 40.2%);
}

.min-vh-75 {
    min-height: 75vh;
}

.icon-wrapper {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
}
</style>