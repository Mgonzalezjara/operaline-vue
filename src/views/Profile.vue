<template>
  <div v-if="singer">
    <div class="header">
      <h1 v-if="!isEditing">{{ singer.name }} {{ singer.last_name }}</h1>
      <div v-else class="edit-fields">
        <input v-model="editedSinger.name" placeholder="Nombre" />
        <input v-model="editedSinger.last_name" placeholder="Apellido" />
      </div>
      <button @click="toggleEdit" class="edit-btn">
        {{ isEditing ? 'Cancelar' : 'Editar perfil' }}
      </button>
    </div>

    <div v-if="isEditing" class="save-btn-container">
      <button @click="saveChanges" class="save-btn">Guardar cambios</button>
    </div>

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

    <!-- Información -->
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

      <div class="socials">
        <p><strong>Redes sociales:</strong></p>
        <ul>
          <li>
            Instagram:
            <span v-if="!isEditing">{{ singer.instagram || 'No disponible' }}</span>
            <input v-else v-model="editedSinger.instagram" placeholder="Instagram" />
          </li>
          <li>
            Twitter:
            <span v-if="!isEditing">{{ singer.twitter || 'No disponible' }}</span>
            <input v-else v-model="editedSinger.twitter" placeholder="Twitter" />
          </li>
          <li>
            Facebook:
            <span v-if="!isEditing">{{ singer.facebook || 'No disponible' }}</span>
            <input v-else v-model="editedSinger.facebook" placeholder="Facebook" />
          </li>
          <li>
            Website:
            <span v-if="!isEditing">{{ singer.website || 'No disponible' }}</span>
            <input v-else v-model="editedSinger.website" placeholder="Website" />
          </li>
        </ul>
      </div>

      <div v-if="singer.organizations?.length">
        <p><strong>Organizaciones:</strong></p>
        <ul>
          <li v-for="org in singer.organizations" :key="org.id">
            {{ getOrganizationName(org.documentId) }} - {{ org.website }}
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

  <div v-else class="loading">Cargando perfil...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { useEntities } from '@/composables/useEntities'

const { locale } = useI18n()
const authStore = useAuthStore()
const { fetchEntities, getCountryName, getVoiceTypeName, getOrganizationName } = useEntities()

const singer = ref<any>(null)
const editedSinger = ref<any>({})
const isEditing = ref(false)

const languages = [
  { code: 'en', label: 'Inglés', flag: '🇬🇧' },
  { code: 'de', label: 'Alemán', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

const activeLang = ref(locale.value.slice(0, 2))
const manualOverride = ref(false)

const loadSinger = async () => {
  const res = await fetch(
    `http://localhost:1337/api/singers?populate=*&filters[users_permissions_user][id][$eq]=${authStore.user.id}`,
    { headers: { Authorization: `Bearer ${authStore.token}` } },
  )
  const data = await res.json()
  singer.value = data.data[0] || null
  editedSinger.value = { ...singer.value }
}

const saveChanges = async () => {
  const updateData = {
    data: {
      name: editedSinger.value.name,
      last_name: editedSinger.value.last_name,
      instagram: editedSinger.value.instagram,
      twitter: editedSinger.value.twitter,
      facebook: editedSinger.value.facebook,
      website: editedSinger.value.website,
    },
  }

  await fetch(`http://localhost:1337/api/singers/${singer.value.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authStore.token}`,
    },
    body: JSON.stringify(updateData),
  })

  await loadSinger()
  isEditing.value = false
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    editedSinger.value = { ...singer.value }
  }
}

const currentBiography = computed(() => {
  if (!singer.value?.biography_text?.length) return null
  const langIndex = { en: 0, de: 1, es: 2 }[activeLang.value] || 0
  return singer.value.biography_text[langIndex]?.biography_text ?? null
})

const manualLanguageChange = (lang: string) => {
  activeLang.value = lang
  manualOverride.value = true
}

const getNationalities = (list: any[]) => list.map((n) => getCountryName(n.documentId)).join(', ')

const hasSocials = computed(() => {
  return (
    singer.value?.instagram ||
    singer.value?.twitter ||
    singer.value?.facebook ||
    singer.value?.website
  )
})

onMounted(async () => {
  await fetchEntities()
  await loadSinger()
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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.edit-fields input {
  margin-right: 0.5rem;
}
.edit-btn,
.save-btn {
  background: #c82333;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.save-btn-container {
  margin-top: 1rem;
}
</style>
