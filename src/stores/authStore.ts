// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwt: null as string | null,
    user: null as any,
  }),
  actions: {
    setJwt(token: string) {
      this.jwt = token
    },
    setUser(user: any) {
      this.user = user
    },
    logout() {
      this.jwt = null
      this.user = null
    },
  },
})
