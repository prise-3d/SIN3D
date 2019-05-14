import Vue from 'vue'
import Router from 'vue-router'
import GdprNotice from '@/views/GdprNotice.vue'
import HostConfig from '@/views/HostConfig.vue'
import Experiments from './experiments'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'gdpr'
    },
    {
      path: '/gdpr',
      name: 'GdprNotice',
      component: GdprNotice
    },
    {
      path: '/hostConfig',
      name: 'HostConfig',
      component: HostConfig
    },
    {
      path: '/experiments',
      name: 'ExperimentsList',
      component: () => import('@/views/ExperimentsList.vue')
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
