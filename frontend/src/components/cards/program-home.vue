<template>
    <div class="col-md-3">
        <div class="card h-100 border-0 shadow-sm" style="background-color: #F8FFE7;">
            <img :src="image" class="card-img-top" alt="Sistem Pertanian Pintar"
                style="padding: 20px 20px 0px 20px;">
            <div class="card-body text-start p-3">
                <h4 class="card-title mb-2">{{ title }}</h4>
                <p class="card-text">
                    {{ description }}
                </p>
                <router-link :to='link' class="text-decoration-none text-success">
                    See more <i class="bi bi-arrow-right"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ProgramCard',
    props: {
        title: String,
        description: String,
        image: String,
        link: String
    }
}
</script>
<style scoped></style>