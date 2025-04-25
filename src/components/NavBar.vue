<template>
  <nav class="navbar">
    <div class="navbar-left">
      <img v-if="layout?.logo?.[0]?.url" :src="layout.logo[0].url" alt="Logo" class="logo" />
    </div>

    <ul class="navbar-center">
      <li v-for="item in layout?.Navigation || []" :key="item.id">
        <router-link :to="item.URL">{{ item.navigation_item }}</router-link>
      </li>
    </ul>

    <div class="navbar-right lang-switcher">
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
import { useLayout } from '@/composables/useLayout'

const { locale } = useI18n()
const { layout } = useLayout()
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-left .logo {
  height: 50px;
}

.navbar-center {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.navbar-center li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.lang-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
