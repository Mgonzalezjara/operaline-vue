// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import SingersList from '@/views/SingersList.vue'
import SingerSingle from '@/views/SingerSingle.vue'
import LoginPage from '@/views/LoginPage.vue'
import Profile from '@/views/Profile.vue'
import { useAuthStore } from '@/stores/authStore'
import Register from '@/views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/singers',
      name: 'Singers',
      component: SingersList,
    },
    {
      path: '/singers/:slug',
      name: 'SingerDetail',
      component: SingerSingle,
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true }, // 👈 añadimos meta para saber que necesita auth
    },
  ],
})

// 👇 Protección de rutas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.token) {
    next({ name: 'LoginPage' }) // 🔥 Redirige a login si no está autenticado
  } else {
    next()
  }
})

export default router
