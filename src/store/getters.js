import { buildURI, buildWsURI } from '../functions'

export default {
  isHostConfigured(state) {
    return !!(state.hostConfig.ssl !== null && state.hostConfig.host && state.hostConfig.port)
  },
  getHostURI(state, getters) {
    if (getters.isHostConfigured)
      return buildURI(state.hostConfig.ssl, state.hostConfig.host, state.hostConfig.port)
  },

  getHostWsURI(state, getters) {
    if (getters.isHostConfigured)
      return buildWsURI(state.hostConfig.ssl, state.hostConfig.host, state.hostConfig.port)
  },

  areScenesLoaded(state) {
    return state.scenesList !== null
  }

  // TODO: Cache scene thumb URI
  // areScenesThumbsLoaded(state) {
  //   return state.scenesList !== null
  // }
}
