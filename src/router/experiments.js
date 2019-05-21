export default [
  {
    path: '/experiments/ExperimentNoReference/:sceneName',
    name: 'ExperimentNoReference',
    fullName: 'No reference image',
    component: () => import('@/views/Experiments/NoReference'),
    props: true
  },
  {
    path: '/experiments/ExperimentWithReference/:sceneName',
    name: 'ExperimentWithReference',
    fullName: 'With reference image',
    component: () => import('@/views/Experiments/WithReference'),
    props: true
  }
]
