import { createRouter, createWebHistory } from 'vue-router'
import FavoriteCharacters from '@/views/FavoriteCharacters.vue';
import StarWarsWiki from '@/views/StarWarsWiki.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: StarWarsWiki,
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: FavoriteCharacters,
    },
  ],
})

export default router
