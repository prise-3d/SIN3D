import { buildURI, buildWsURI } from '../functions'

export default {
  isHostConfigured(state) {
    if (!state) return
    return !!(state.hostConfig.ssl !== null && state.hostConfig.host && state.hostConfig.port)
  },
  getHostURI(state, getters) {
    if (!state) return
    if (getters.isHostConfigured)
      return buildURI(state.hostConfig.ssl, state.hostConfig.host, state.hostConfig.port)
  },

  getHostWsURI(state, getters) {
    if (!state) return
    if (getters.isHostConfigured)
      return buildWsURI(state.hostConfig.ssl, state.hostConfig.host, state.hostConfig.port, state.uuid)
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
  }

}
