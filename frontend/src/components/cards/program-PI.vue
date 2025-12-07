<template>
    <div class="col-md-3 mb-4">
        <div class="card h-100 border-0 shadow-sm position-relative" style="background-color: #f8ffe7">
            <span class="badge bg-success position-absolute end-0 m-3 px-3 py-2">{{ status }}</span>
            <img :src="image" class="card-img-top" :alt="name" />
            <div class="card-body">
                <h4 class="card-title fw-bold">{{ name }}</h4>
                <h6 class="text-success mb-3">{{ Jenis }}</h6>
                <p class="card-text">
                    {{ description }}
                </p>
            </div>
            <div class="card-footer border-0 pb-3" style="background-color: #f8ffe7">
                <router-link :to="link" class="btn btn-outline-success">
                    Pelajari Selanjutnya
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'cardsPRogram',
    props: {
        name: String,
        description: String,
        jenis: {
            type: String,
            default: 'Program Umum'
        },
        image: String,
        status: String,
        link: String,

    }
}
</script>
<style scoped></style>