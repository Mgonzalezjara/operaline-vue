<script setup lang="ts">
import Navbar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <main class="content">
      <RouterView />
    </main>
    <footer class="footer">
      <Footer />
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 2rem;
  background-color: #f9f9f9;
}
</style>
