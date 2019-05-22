export default [
  {
    path: '/experiments/ExperimentWithReference/:sceneName',
    name: 'ExperimentWithReference',
    component: () => import('@/views/Experiments/WithReference'),
    props: true,
    meta: {
      fullName: 'Match extracts qualities to reference image'
    }
  },
  {
    path: '/experiments/ExperimentAreSameImagesRandom/:sceneName',
    name: 'ExperimentAreSameImagesRandom',
    component: () => import('@/views/Experiments/AreSameImagesRandom'),
    props: true,
    meta: {
      fullName: 'Are images the same ? (Both are random qualities images)'
    }
  },
  {
    path: '/experiments/ExperimentAreSameImagesReference/:sceneName',
    name: 'ExperimentAreSameImagesReference',
    component: () => import('@/views/Experiments/AreSameImagesReference'),
    props: true,
    meta: {
      fullName: 'Are images the same ? (One is reference image, the other is random quality)'
    }
  }
]
