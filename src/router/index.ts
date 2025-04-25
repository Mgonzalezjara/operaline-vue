import { createRouter, createWebHistory } from 'vue-router'
import SingersList from '@/views/SingersList.vue'
import SingerSingle from '@/views/SingerSingle.vue'
import LoginPage from '@/views/LoginPage.vue'

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
  ],
})

export default router
