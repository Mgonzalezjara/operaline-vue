<template>
  <div v-if="singer">
    <h1>{{ getField('name') }}</h1>

    <img
      v-if="getField('profile_image')?.formats?.small?.url"
      :src="getField('profile_image').formats.small.url"
      alt="Foto"
      class="img"
    />

    <p>
      <strong>Nacionalidad:</strong>
      {{
        getField('nationality')
          ?.map((n: any) => n.name)
          .join(', ') || 'No disponible en este idioma'
      }}
    </p>
    <p>
      <strong>Lugar de nacimiento:</strong>
      {{ getField('birth_place')?.name || 'No disponible en este idioma' }}
    </p>
    <p><strong>Voz:</strong> {{ getField('voice')?.title || 'No disponible en este idioma' }}</p>

    <div v-if="hasAnySocialLink()">
      <h3>Redes sociales</h3>
      <ul>
        <li v-if="getField('instagram')">
          Instagram:
          <a :href="getField('instagram')" target="_blank">{{ getField('instagram') }}</a>
        </li>
        <li v-if="getField('twitter')">
          Twitter: <a :href="getField('twitter')" target="_blank">{{ getField('twitter') }}</a>
        </li>
        <li v-if="getField('facebook')">
          Facebook: <a :href="getField('facebook')" target="_blank">{{ getField('facebook') }}</a>
        </li>
        <li v-if="getField('website')">
          Sitio web: <a :href="getField('website')" target="_blank">{{ getField('website') }}</a>
        </li>
      </ul>
    </div>

    <div>
      <h3>Biografía</h3>
      <div v-if="getField('biography')?.length">
        <div v-for="(block, index) in getField('biography')" :key="index">
          <p>{{ block.children[0]?.text }}</p>
        </div>
      </div>
      <p v-else>No disponible en este idioma</p>
    </div>

    <div>
      <h3>Galería</h3>
      <div v-if="getField('gallery')?.length" class="gallery">
        <img
          v-for="image in getField('gallery')"
          :key="image.id"
          :src="image.formats?.thumbnail?.url || image.url"
          :alt="image.name"
          class="gallery-img"
        />
      </div>
      <p v-else>No disponible en este idioma</p>
    </div>
  </div>

  <div v-else class="loading">Cargando cantante...</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { locale } = useI18n()
const singer = ref<any | null>(null)
const fallback = ref<any | null>(null)

const fetchSinger = async () => {
  const slug = route.params.slug

  // idioma actual
  const res = await fetch(
    `http://localhost:1337/api/singers?populate=*&filters[slug][$eq]=${slug}&locale=${locale.value}`,
  )
  const data = await res.json()
  singer.value = data.data[0] || null

  // fallback por defecto: inglés
  if (locale.value !== 'en') {
    const fallbackRes = await fetch(
      `http://localhost:1337/api/singers?populate=*&filters[slug][$eq]=${slug}&locale=en`,
    )
    const fallbackData = await fallbackRes.json()
    fallback.value = fallbackData.data[0] || null
  } else {
    fallback.value = null
  }
}

const getField = (field: string) => {
  return singer.value?.[field] ?? fallback.value?.[field] ?? null
}

const hasAnySocialLink = () => {
  return ['instagram', 'twitter', 'facebook', 'website'].some((field) => getField(field))
}

onMounted(fetchSinger)
watch(locale, fetchSinger)
</script>

<style scoped>
.loading {
  text-align: center;
  margin-top: 2rem;
}
.img {
  width: 300px;
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 8px;
}
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.gallery-img {
  width: 150px;
  height: auto;
  border-radius: 8px;
}
</style>
