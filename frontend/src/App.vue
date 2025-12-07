<template>
  <newNavbar v-if="showNavbar" />
  <Header v-if="isAdminLayout" />
  <Sidebar v-if="isAdminLayout" />
  <router-view />
  <Footer v-if="showFooter" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import newNavbar from "./components/newNavbar.vue";
import Header from "./components/admin/Header.vue";
import Sidebar from "./components/admin/Sidebar.vue";
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";

const route = useRoute();

// Cek route yang tidak terdaftar
const isUnregisteredRoute = computed(() => {
  return route.matched.length === 0;
});

// Cek halaman auth
const isAuthPage = computed(() => {
  const authRoutes = ["/login", "/register", "/forgot-password"];
  return authRoutes.includes(route.path);
});

// Cek halaman admin
const isAdminLayout = computed(() => {
  return route.path.startsWith('/admin');
});

// Tampilkan navbar hanya jika:
// - Bukan halaman auth
// - Bukan halaman admin
// - Bukan route yang tidak terdaftar
const showNavbar = computed(() => {
  return !isAuthPage.value && !isAdminLayout.value && !isUnregisteredRoute.value;
});

// Tampilkan footer dengan kondisi yang sama seperti navbar
const showFooter = computed(() => {
  return !isAuthPage.value && !isAdminLayout.value && !isUnregisteredRoute.value;
});
</script>