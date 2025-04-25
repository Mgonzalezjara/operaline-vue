<template>
  <div>
    <h3>Galería</h3>
    <Swiper
      v-if="getField('gallery')?.length"
      :slides-per-view="2"
      :space-between="16"
      :loop="true"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :speed="800"
      :pagination="false"
      class="gallery-swiper"
      :breakpoints="{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }"
    >
      <SwiperSlide v-for="image in getField('gallery')" :key="image.id">
        <img :src="image.formats?.small?.url || image.url" :alt="image.name" class="swiper-img" />
      </SwiperSlide>
    </Swiper>
    <p v-else>No disponible</p>
  </div>

  <div v-if="singer">
    <h1>{{ getField('name') }} {{ getField('last_name') }}</h1>

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
          .join(', ') || 'No disponible'
      }}
    </p>
    <p>
      <strong>Lugar de nacimiento:</strong>
      {{ getField('birth_place')?.name || 'No disponible' }}
    </p>
    <p><strong>Voz:</strong> {{ getField('voice')?.title || 'No disponible' }}</p>

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
      <p v-else>No disponible</p>
    </div>
  </div>

  <div v-else class="loading">Cargando cantante...</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import SwiperCore from 'swiper'

// Activar el módulo Autoplay
SwiperCore.use([Autoplay])

import 'swiper/css'
// Solo si usas navegación o paginación visual
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

const route = useRoute()
const { locale } = useI18n()
const singer = ref<any | null>(null)
const fallback = ref<any | null>(null)

const fetchSinger = async () => {
  const slug = route.params.slug

  const res = await fetch(
    `http://localhost:1337/api/singers?populate=*&filters[slug][$eq]=${slug}&locale=${locale.value}`,
  )
  const data = await res.json()
  singer.value = data.data[0] || null

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
.gallery-swiper {
  width: 100%;
  margin: 1rem 0;
}
.swiper-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
