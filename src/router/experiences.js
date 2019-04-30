export default [
  {
    path: '/experiences/noReference',
    name: 'ExperienceNoReference',
    fullName: 'No reference image',
    component: () => import('@/views/Experiences/NoReference.vue')
  },
  {
    path: '/experiences/withReference',
    name: 'ExperienceWithReference',
    fullName: 'With reference image',
    component: () => import('@/views/Experiences/WithReference.vue')
  }
]
