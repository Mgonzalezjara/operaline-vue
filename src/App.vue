<script setup lang="ts">
import Navbar from './components/NavBar.vue'
</script>

<template>
  <div class="app-layout">
    <Navbar />
    <main class="content">
      <RouterView />
    </main>
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
