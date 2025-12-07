<template>
  <div class="col-md-4 mb-3">
    <div class="card h-100 bg-light">
      <div class="card-body">
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-text display-4">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bg-light {
  background-color: #f8ffed !important;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: 700;
}
</style>