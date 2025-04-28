// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<any>(null)
  const singers = ref<any[]>([])

  const setToken = (newToken: string) => {
    token.value = newToken
  }

  const setUser = (newUser: any) => {
    user.value = newUser
  }

  const fetchSingers = async () => {
    if (!user.value || !token.value) return

    const res = await fetch(
      `http://localhost:1337/api/singers?populate=*&filters[users_permissions_user][id][$eq]=${user.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    )
    const data = await res.json()
    singers.value = data.data || []
  }

  const getSingerByLocale = (locale: string) => {
    if (!singers.value.length) return null
    const found = singers.value.find((singer: any) => singer.locale === locale)
    if (found) return found

    // fallback: buscar en inglés o el primero
    return singers.value.find((singer: any) => singer.locale === 'en') || singers.value[0]
  }

  const logout = () => {
    token.value = null
    user.value = null
    singers.value = []
  }

  return {
    token,
    user,
    singers,
    setToken,
    setUser,
    fetchSingers,
    getSingerByLocale,
    logout,
  }
})
