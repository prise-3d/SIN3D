import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Experiences from './experiences'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/experiencesList',
      name: 'ExperiencesList',
      component: () => import('@/views/ExperiencesList.vue')
    },
    ...Experiences
  ]
})
