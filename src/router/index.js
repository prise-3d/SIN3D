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
      path: '/linkGenerator',
      name: 'LinkGenerator',
      component: () => import('@/views/LinkGenerator')
    },
    {
      path: '/experiments',
      name: 'ExperimentsList',
      component: () => import('@/views/ExperimentsList')
    },
    {
      path: '/scenes',
      name: 'ScenesList',
      component: () => import('@/views/ScenesList')
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
