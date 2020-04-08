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
  getUserId(state) {
    return state.userId
  },
  getExperimentId(state) {
    return state.experimentId
  },
  areScenesLoaded(state) {
    if (!state) return
    return state.scenesList !== null
  },

  // TODO: Cache scene thumb URI
  // areScenesThumbsLoaded(state) {
  //   return state.scenesList !== null
  // }
  getAllExperimentProgress: state => () => {
    if (!state) return
    // use of experiment and user id to store progression
    if (state.progression && state.progression[state.experimentId] && state.progression[state.experimentId][state.userId] && state.progression[state.experimentId][state.userId])
      return state.progression[state.experimentId][state.userId]
  },
  getExperimentProgress: state => ({ experimentName, sceneName }) => {
    if (!state) return
    // use of experiment and user id to store progression
    if (state.progression && state.progression[state.experimentId] && state.progression[state.experimentId][state.userId] && state.progression[state.experimentId][state.userId][experimentName])
      return state.progression[state.experimentId][state.userId][experimentName][sceneName].data
  },

  isExperimentDone: state => ({ experimentName, sceneName }) => {
    if (!state) return

    // use of experiment and user id to store progression
    if (state.progression && state.progression[state.experimentId] && state.progression[state.experimentId][state.userId] && state.progression[state.experimentId][state.userId][experimentName])
      return state.progression[state.experimentId][state.userId][experimentName][sceneName].done
  }
}
