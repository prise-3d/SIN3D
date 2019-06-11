export default {
  isGdprValidated(state) {
    if (!state) return
    return state.gdprConsent
  },
  isHostConfigured(state) {
    if (!state) return
    return state.hostConfig !== null
  },
  getHostURI(state, getters) {
    if (!state) return
    if (getters.isHostConfigured)
      return state.hostConfig
  },

  areScenesLoaded(state) {
    if (!state) return
    return state.scenesList !== null
  },

  // TODO: Cache scene thumb URI
  // areScenesThumbsLoaded(state) {
  //   return state.scenesList !== null
  // }

  getExperimentProgress: state => ({ experimentName, sceneName }) => {
    if (!state) return
    if (state.progression && state.progression[experimentName])
      return state.progression[experimentName][sceneName].data
  },

  isExperimentDone: state => ({ experimentName, sceneName }) => {
    if (!state) return
    if (state.progression && state.progression[experimentName])
      return state.progression[experimentName][sceneName].done
  }
}
