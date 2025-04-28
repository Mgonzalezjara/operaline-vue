<template>
  <div v-if="singer">
    <h1>{{ singer.name }} {{ singer.last_name || '' }}</h1>

    <img
      v-if="singer.profile_image?.formats?.small?.url"
      :src="singer.profile_image.formats.small.url"
      alt="Foto"
      class="profile-img"
    />

    <p>
      <strong>Nacionalidad:</strong>
      {{ singer.nationality?.map((n: any) => n.name).join(', ') || 'No disponible' }}
    </p>
    <p><strong>Lugar de nacimiento:</strong> {{ singer.birth_place?.name || 'No disponible' }}</p>

    <div>
      <h3>Biografía</h3>
      <div v-if="singer.biography?.length">
        <div v-for="(block, index) in singer.biography" :key="index">
          <p>{{ block.children[0]?.text }}</p>
        </div>
      </div>
      <p v-else>No disponible</p>
    </div>
  </div>

  <div v-else class="loading">Cargando perfil...</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const authStore = useAuthStore()
const singer = ref<any>(null)

const loadSinger = async () => {
  if (!authStore.user) return

  try {
    const res = await fetch(
      `http://localhost:1337/api/singers?populate=*&filters[users_permissions_user][id][$eq]=${authStore.user.id}&locale=${locale.value}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    const data = await res.json()

    if (data.data.length > 0) {
      singer.value = data.data[0]
    } else {
      // fallback a inglés
      const fallbackRes = await fetch(
        `http://localhost:1337/api/singers?populate=*&filters[users_permissions_user][id][$eq]=${authStore.user.id}&locale=en`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      )
      const fallbackData = await fallbackRes.json()
      singer.value = fallbackData.data[0] || null
    }
  } catch (error) {
    console.error('Error loading singer on locale switch:', error)
    singer.value = null
  }
}

onMounted(loadSinger)
watch(locale, loadSinger)
</script>

<style scoped>
.profile-img {
  width: 300px;
  height: auto;
  max-width: 100%;
  border-radius: 8px;
}
.loading {
  text-align: center;
}
</style>
