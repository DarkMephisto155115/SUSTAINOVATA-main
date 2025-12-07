<template>
    <div class="card mb-4 border-0 shadow-sm">
          <div class="row g-0">
            <div class="col-md-3">
              <img :src="image" class="img-fluid rounded-start h-100 w-100 object-fit-cover" :alt="title">
            </div>
            <div class="col-md-9">
              <div class="card-body p-4">
                <h3 class="card-title text-success fw-bold"></h3>{{ title }}
                <p class="text-muted mb-1">{{ publisher }}</p>
                <p class="text-muted small mb-3">
                  <i class="bi bi-calendar me-1"></i> {{ publishDate }}
                </p>
                <p class="card-text">
                    {{ description }}
                </p>
                <router-link :to="link" class="text-decoration-none text-success">
                  Baca selengkapnya <i class="bi bi-arrow-right"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
</template>

<script>
export default {
    name: 'CardNews',
    props: {
        title: String,
        publisher: {
            type: String,
            default: 'Sustainovata.news'
        },
        image: String,
        link: String,
        description: String,
        publishDate: String
    }
};
</script>
<style>

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.object-fit-cover {
  object-fit: cover;
}

.page-link {
  color: #198754;
}

.page-item.active .page-link {
  background-color: #198754;
  border-color: #198754;
}
</style>