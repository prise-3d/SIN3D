export default [
  {
    path: '/experiments/MatchExtractsWithReference/:sceneName',
    name: 'MatchExtractsWithReference',
    component: () => import('@/views/Experiments/MatchExtractsWithReference'),
    props: true,
    meta: {
      fullName: 'Cliquer sur les zones de l\'image de gauche (clic gauche de la souris)  afin de la faire correspondre à celle de droite'
      // fullName: 'Match extracts qualities to reference image'
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
      fullName: 'Check if reconstructed image is correct'
    }
  },
  {
    path: '/experiments/IsImageCorrectOneExtract/:sceneName',
    name: 'IsImageCorrectOneExtract',
    component: () => import('@/views/Experiments/IsImageCorrectOneExtract'),
    props: true,
    meta: {
      fullName: 'Check if reconstructed image with one different extract is correct'
    }
  },
  {
    path: '/experiments/CalibrationMeasurement/:sceneName',
    name: 'CalibrationMeasurement',
    component: () => import('@/views/Experiments/CalibrationMeasurement'),
    props: true,
    meta: {
      fullName: 'Cliquer sur les zones de l\'image de gauche (clic gauche de la souris)  afin de faire correspondre la teinte à celle de droite'
    }
  }
]
