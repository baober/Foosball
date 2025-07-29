import { createRouter, createWebHistory } from 'vue-router'
import Match from '@/views/Match.vue'
import Ranking from '@/views/Ranking.vue'
import Details from '@/views/Details.vue'
import Profile from '@/views/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/match'
    },
    {
      path: '/match',
      name: 'match',
      component: Match
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: Ranking
    },
    {
      path: '/details',
      name: 'details',
      component: Details
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    }
  ]
})

export default router