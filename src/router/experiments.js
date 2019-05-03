export default [
  {
    path: '/experiments/noReference',
    name: 'ExperimentNoReference',
    fullName: 'No reference image',
    component: () => import('@/views/Experiments/NoReference.vue')
  },
  {
    path: '/experiments/withReference',
    name: 'ExperimentWithReference',
    fullName: 'With reference image',
    component: () => import('@/views/Experiments/WithReference.vue')
  }
]
