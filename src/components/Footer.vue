<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Logo -->
      <div class="footer-left">
        <img
          v-if="layout?.logo?.[0]?.url"
          :src="layout.logo[0].url"
          alt="Logo"
          class="footer-logo"
        />
      </div>

      <!-- Info contacto -->
      <div class="footer-center">
        <h3>{{ layout?.contact_us }}</h3>
        <p>{{ layout?.company_name }}</p>
        <p>{{ layout?.company_info?.address }}</p>
        <p>{{ layout?.company_info?.post_code }}</p>

        <p>
          <a :href="`tel:${layout?.company_info?.phone}`">
            Tel: {{ layout?.company_info?.phone }}
          </a>
        </p>
        <p>
          <a :href="`fax:${layout?.company_info?.fax}`"> Fax: {{ layout?.company_info?.fax }} </a>
        </p>
        <p>
          <a :href="`mailto:${layout?.company_info?.email}`">
            {{ layout?.company_info?.email }}
          </a>
        </p>
      </div>

      <!-- Redes sociales con íconos locales -->
      <div class="footer-right">
        <a
          v-if="layout?.company_info?.facebook"
          :href="layout.company_info.facebook"
          target="_blank"
        >
          <img src="@/assets/icons/logo.svg" alt="Facebook" class="social-icon" />
        </a>
        <a v-if="layout?.company_info?.twitter" :href="layout.company_info.twitter" target="_blank">
          <img src="@/assets/icons/logo.svg" alt="Twitter" class="social-icon" />
        </a>
        <a
          v-if="layout?.company_info?.instagram"
          :href="layout.company_info.instagram"
          target="_blank"
        >
          <img src="@/assets/icons/logo.svg" alt="Instagram" class="social-icon" />
        </a>
      </div>
    </div>

    <!-- Menú inferior -->
    <div class="footer-bottom">
      <ul>
        <li v-for="item in layout?.Navigation || []" :key="item.id">
          <router-link :to="item.URL">{{ item.navigation_item }}</router-link>
        </li>
        <li><router-link to="/impressum">Impressum</router-link></li>
        <li><router-link to="/datenschutz">Datenschutz</router-link></li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useLayout } from '@/composables/useLayout'
const { layout } = useLayout()
</script>

<style scoped>
.footer {
  background: #fff;
  padding: 2rem 1rem;
  border-top: 1px solid #ddd;
  font-size: 0.9rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.footer-logo {
  height: 60px;
  margin-bottom: 1rem;
}

.footer-center {
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
}

.footer-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.social-icon {
  height: 24px;
  width: 24px;
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid #ccc;
  padding-top: 1rem;
}

.footer-bottom ul {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-bottom a {
  text-decoration: none;
  color: #333;
}
</style>
