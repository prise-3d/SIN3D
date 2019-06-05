export default [
  {
    path: '/experiments/MatchExtractsWithReference/:sceneName',
    name: 'MatchExtractsWithReference',
    component: () => import('@/views/Experiments/MatchExtractsWithReference'),
    props: true,
    meta: {
      fullName: 'Match extracts qualities to reference image'
    }
  },
  {
    path: '/experiments/AreSameImagesRandom/:sceneName',
    name: 'AreSameImagesRandom',
    component: () => import('@/views/Experiments/AreSameImagesRandom'),
    props: true,
    meta: {
      fullName: 'Are images the same ? (Both are random qualities images)'
    }
  },
  {
    path: '/experiments/AreSameImagesReference/:sceneName',
    name: 'AreSameImagesReference',
    component: () => import('@/views/Experiments/AreSameImagesReference'),
    props: true,
    meta: {
      fullName: 'Are images the same ? (One is reference image, the other is random quality)'
    }
  },
  {
    path: '/experiments/AreSameImagesReferenceOneExtract/:sceneName',
    name: 'AreSameImagesReferenceOneExtract',
    component: () => import('@/views/Experiments/AreSameImagesReferenceOneExtract'),
    props: true,
    meta: {
      fullName: 'Are images the same ? (Both are reference images but one contains a random quality extract)'
    }
  },
  {
    path: '/experiments/PercentQualityRandom/:sceneName',
    name: 'PercentQualityRandom',
    component: () => import('@/views/Experiments/PercentQualityRandom'),
    props: true,
    meta: {
      fullName: 'Choose a score for quality'
    }
  },
  {
    path: '/experiments/IsImageCorrect/:sceneName',
    name: 'IsImageCorrect',
    component: () => import('@/views/Experiments/IsImageCorrect'),
    props: true,
    meta: {
      fullName: 'Check if image is correct'
    }
  }
]
