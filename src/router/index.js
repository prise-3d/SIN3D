import Vue from 'vue'
import Router from 'vue-router'
import GdprNotice from '@/views/GdprNotice'
import HostConfig from '@/views/HostConfig'
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
      component: () => import('@/views/ExperimentsList')
    },
    {
      path: '/experiments/:experimentName',
      name: 'SelectExperimentScene',
      component: () => import('@/views/SelectExperimentScene'),
      props: true
    },
    {
      path: '/experiments/:experimentName/:sceneName/validated',
      name: 'ExperimentValidated',
      component: () => import('@/views/ExperimentValidated'),
      props: true
    },
    ...Experiments
  ]
})
