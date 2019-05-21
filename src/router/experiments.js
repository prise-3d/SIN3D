export default [
  {
    path: '/experiments/ExperimentWithReference/:sceneName',
    name: 'ExperimentWithReference',
    fullName: 'With reference image',
    component: () => import('@/views/Experiments/WithReference'),
    props: true
  },
  {
    path: '/experiments/ExperimentAreSameImages/:sceneName',
    name: 'ExperimentAreSameImages',
    fullName: 'Are images the same',
    component: () => import('@/views/Experiments/AreSameImages'),
    props: true
  }
]
