<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar">
    <div class="logo">🎶 Operaline</div>
    <div class="lang-switcher">
      <label for="lang">{{ $t('language') }}:</label>
      <select id="lang" v-model="locale">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
// ✅ usamos directamente locale como v-model
</script>
