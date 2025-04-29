<template>
  <div v-if="singer">
    <h1>{{ singer.name }} {{ singer.last_name }}</h1>

    <!-- Galería -->
    <div v-if="singer.gallery?.length">
      <Swiper
        :slides-per-view="2"
        :space-between="16"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        class="gallery-swiper"
      >
        <SwiperSlide v-for="image in singer.gallery" :key="image.id">
          <img :src="image.formats?.small?.url || image.url" :alt="image.name" class="swiper-img" />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Foto perfil -->
    <img
      v-if="singer.profile_image?.formats?.small?.url"
      :src="singer.profile_image.formats.small.url"
      alt="Foto de perfil"
      class="profile-img"
    />

    <!-- Información Reactiva y localizada -->
    <div class="info">
      <p v-if="singer.nationality?.length">
        <strong>Nacionalidad:</strong> {{ getNationalities(singer.nationality) }}
      </p>

      <p v-if="singer.birth_place">
        <strong>Lugar de nacimiento:</strong> {{ getCountryName(singer.birth_place.documentId) }}
      </p>

      <p v-if="singer.voice">
        <strong>Voz:</strong> {{ getVoiceTypeName(singer.voice.documentId) }}
      </p>

      <div class="socials" v-if="hasSocials">
        <p><strong>Redes sociales:</strong></p>
        <ul>
          <li v-if="singer.instagram">
            <a :href="singer.instagram" target="_blank">Instagram</a>
          </li>
          <li v-if="singer.twitter">
            <a :href="singer.twitter" target="_blank">Twitter</a>
          </li>
          <li v-if="singer.facebook">
            <a :href="singer.facebook" target="_blank">Facebook</a>
          </li>
          <li v-if="singer.website">
            <a :href="singer.website" target="_blank">Website</a>
          </li>
        </ul>
      </div>

      <!-- Organizaciones reactivas y localizadas -->
      <div v-if="singer.organizations?.length">
        <p><strong>Organizaciones:</strong></p>
        <ul>
          <li v-for="org in singer.organizations" :key="org.id">
            {{ getOrganizationName(org.documentId) }} -
            <a :href="org.website" target="_blank">{{ org.website }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Biografía -->
    <div class="biography-section">
      <h3>Biografía</h3>
      <div class="bio-tabs">
        <button
          v-for="lang in languages"
          :key="lang.code"
          :class="{ active: activeLang === lang.code }"
          @click="manualLanguageChange(lang.code)"
        >
          <span class="flag">{{ lang.flag }}</span> {{ lang.label }}
        </button>
      </div>
      <div v-if="currentBiography?.length">
        <div v-for="(block, index) in currentBiography" :key="index">
          <p>{{ block.children[0]?.text }}</p>
        </div>
      </div>
      <p v-else>No disponible en este idioma.</p>
    </div>
  </div>

  <div v-else class="loading">Cargando cantante...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { useEntities } from '@/composables/useEntities'

const route = useRoute()
const { locale } = useI18n()

const singer = ref<any>(null)
const { fetchEntities, getCountryName, getOrganizationName, getVoiceTypeName } = useEntities()

const languages = [
  { code: 'en', label: 'Inglés', flag: '🇬🇧' },
  { code: 'de', label: 'Alemán', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

const activeLang = ref('en')
const manualOverride = ref(false)

const fetchSinger = async () => {
  const slug = route.params.slug
  const res = await fetch(`http://localhost:1337/api/singers?populate=*&filters[slug][$eq]=${slug}`)
  const data = await res.json()
  singer.value = data.data[0] || null
}

const currentBiography = computed(() => {
  if (!singer.value?.biography_text?.length) return null
  const langIndex = { en: 0, de: 1, es: 2 }[activeLang.value] || 0
  return singer.value.biography_text[langIndex]?.biography_text ?? null
})

const initActiveLanguage = () => {
  const browserLang = locale.value.slice(0, 2)
  activeLang.value = ['es', 'de', 'en'].includes(browserLang) ? browserLang : 'en'
}

const manualLanguageChange = (lang: string) => {
  activeLang.value = lang
  manualOverride.value = true
}

watch(locale, (newLocale) => {
  if (!manualOverride.value) {
    const newLang = newLocale.slice(0, 2)
    activeLang.value = ['es', 'de', 'en'].includes(newLang) ? newLang : 'en'
  }
})

const hasSocials = computed(
  () =>
    singer.value?.instagram ||
    singer.value?.twitter ||
    singer.value?.facebook ||
    singer.value?.website,
)

// Maneja múltiples nacionalidades reactivas
const getNationalities = (nationalities: any[]) => {
  return nationalities.map((n) => getCountryName(n.documentId)).join(', ') || 'No disponible'
}

onMounted(async () => {
  await fetchEntities()
  initActiveLanguage()
  await fetchSinger()
})

watch(locale, fetchEntities)
</script>

<style scoped>
.loading {
  text-align: center;
  margin-top: 2rem;
}
.profile-img {
  width: 250px;
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 8px;
}
.gallery-swiper {
  width: 100%;
  margin: 1rem 0 2rem 0;
}
.swiper-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}
.info {
  margin-bottom: 2rem;
}
.socials ul,
.info ul {
  list-style: none;
  padding: 0;
}
.socials ul li,
.info ul li {
  margin: 0.5rem 0;
}
.biography-section {
  margin-top: 2rem;
}
.bio-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
}
.bio-tabs button {
  padding: 0.5rem 1rem;
  background: #ccc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.bio-tabs button.active {
  background: #c82333;
  color: white;
}
.flag {
  font-size: 1.2rem;
}
</style>
