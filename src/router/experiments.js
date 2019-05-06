export default [
  {
    path: '/experiments/ExperimentNoReference/:sceneId',
    name: 'ExperimentNoReference',
    fullName: 'No reference image',
    component: () => import('@/views/Experiments/NoReference.vue'),
    props: true
  },
  {
    path: '/experiments/ExperimentWithReference/:sceneId',
    name: 'ExperimentWithReference',
    fullName: 'With reference image',
    component: () => import('@/views/Experiments/WithReference.vue'),
    props: true
  }
]
