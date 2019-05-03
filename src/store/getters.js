import { buildURI } from '../functions'

export default {
  isHostConfigured(state) {
    return !!(state.hostConfig.protocol && state.hostConfig.host && state.hostConfig.protocol)
  },
  getHostURI(state, getters) {
    if (getters.isHostConfigured)
      return buildURI(state.hostConfig.protocol, state.hostConfig.host, state.hostConfig.port)
  },

  areScenesLoaded(state) {
    return state.scenesList !== null
  }

  // TODO: Cache scene thumb URI
  // areScenesThumbsLoaded(state) {
  //   return state.scenesList !== null
  // }
}
