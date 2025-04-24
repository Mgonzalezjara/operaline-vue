import { createRouter, createWebHistory } from 'vue-router'
import SingersList from '@/views/SingersList.vue'
import SingerSingle from '@/views/SingerSingle.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Singers',
      component: SingersList,
    },
    {
      path: '/singers/:slug',
      name: 'SingerDetail',
      component: SingerSingle,
    },
  ],
})

export default router
