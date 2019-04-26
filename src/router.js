import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/listScenes',
      name: 'ListScenes',
      component: () => import('./views/ListScenes.vue')
    }
  ]
})
