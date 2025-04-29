<template>
  <div v-if="singers.length">
    <h1>{{ pageData?.title || 'Lista de cantantes' }}</h1>
    <p>{{ pageData?.subtitle }}</p>

    <div class="grid">
      <div v-for="singer in singers" :key="singer.id" class="card" @click="goToSinger(singer.slug)">
        <img
          v-if="singer.profile_image?.formats?.thumbnail?.url"
          :src="singer.profile_image.formats.thumbnail.url"
          alt="Foto"
          class="img"
        />
        <h3>{{ singer.name }} {{ singer.last_name }}</h3>

        <p>
          <strong>{{ pageData?.nationality_text || 'Nacionalidad' }}:</strong>
          {{ getNationalitiesFromSinger(singer) }}
        </p>

        <p>
          <strong>Lugar de nacimiento:</strong>
          {{ getBirthPlaceNameFromSinger(singer) }}
        </p>

        <p>
          <strong>Voz:</strong>
          {{ getVoiceTypeNameFromSinger(singer) }}
        </p>

        <p>
          <strong>Organización:</strong>
          {{ getOrganizationNameFromSinger(singer) }}
        </p>
      </div>
    </div>
  </div>

  <div v-else class="loading">Cargando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEntities } from '@/composables/useEntities'

const singers = ref<any[]>([])
const pageData = ref<any | null>(null)
const { locale } = useI18n()
const router = useRouter()

const { fetchEntities, getCountryName, getOrganizationName, getVoiceTypeName } = useEntities()

const fetchSingers = async () => {
  const res = await fetch(`http://localhost:1337/api/singers?populate=*&locale=en`)
  const data = await res.json()
  singers.value = data.data
}

const fetchPageData = async () => {
  const res = await fetch(`http://localhost:1337/api/singers-page?locale=${locale.value}`)
  const data = await res.json()
  pageData.value = data.data
}

const goToSinger = (slug: string) => {
  if (slug) router.push(`/singers/${slug}`)
}

// Ahora maneja múltiples nacionalidades:
const getNationalitiesFromSinger = (singer: any) => {
  if (!singer.nationality?.length) return 'No disponible'
  return singer.nationality.map((country: any) => getCountryName(country.documentId)).join(', ')
}

// lugar de nacimiento:
const getBirthPlaceNameFromSinger = (singer: any) => {
  const birthPlace = singer.birth_place
  if (!birthPlace || !birthPlace.documentId) return 'No disponible'
  return getCountryName(birthPlace.documentId)
}

// voice corregido usando correctamente el composable:
const getVoiceTypeNameFromSinger = (singer: any) => {
  const voice = singer.voice
  if (!voice || !voice.documentId) return 'No disponible'
  return getVoiceTypeName(voice.documentId)
}

// organización:
const getOrganizationNameFromSinger = (singer: any) => {
  const organization = singer.organizations?.[0]
  if (!organization || !organization.documentId) return 'No disponible'
  return getOrganizationName(organization.documentId)
}

onMounted(async () => {
  await fetchEntities()
  await fetchSingers()
  await fetchPageData()
})

watch(locale, async () => {
  await fetchEntities()
  await fetchPageData()
})
</script>

<style scoped>
.loading {
  text-align: center;
  margin-top: 2rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
.card {
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
