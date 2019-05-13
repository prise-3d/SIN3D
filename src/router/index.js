import Vue from 'vue'
import Router from 'vue-router'
import ExperimentsList from '@/views/ExperimentsList.vue'
import Experiments from './experiments'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/experimentsList'
    },
    {
      path: '/experimentsList',
      name: 'ExperimentsList',
      component: ExperimentsList
    },
    {
      path: '/experiments/:experimentName',
      name: 'SelectExperimentScene',
      component: () => import('@/views/SelectExperimentScene.vue'),
      props: true
    },
    ...Experiments
  ]
})
