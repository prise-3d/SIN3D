import { API_ROUTES, buildURI } from '../functions'

export default {
  async increment({ commit }, amount = 1) {
    commit('increment', amount)
  },

  async decrement({ commit }, amount = 1) {
    commit('increment', -amount)
  },

  resetApp({ commit }, { hostConfig = false, scenesList = false }) {
    commit('resetApp', { hostConfig, scenesList })
  },

  async setHostConfig({ commit }, { protocol, host, port }) {
    // Timeout after 1s
    const controller = new AbortController()
    const signal = controller.signal
    setTimeout(() => controller.abort(), 1500)

    const URI = buildURI(protocol, host, port, API_ROUTES.ping())
    return fetch(URI, { signal })
      .then(async res => {
        if (res.status !== 200) throw new Error(`Received wrong HTTP status code : ${res.status} (Need 200).`)

        const content = await res.text()
        if (content !== 'pong') throw new Error('Received wrong web content (Need to receive "pong").')

        // Configuration is valid
        commit('setHostConfig', { protocol, host, port })
      })
      .catch(err => {
        // Host not reachable or invalid HTTP status code
        throw new Error(`Invalid configuration "${URI}". ${!err.message.includes('aborted') ? err.message : ''}`)
      })
  },

  async loadScenesList({ getters: { isHostConfigured, getHostURI }, commit }) {
    if (!isHostConfigured) throw new Error('Host is not configured.')

    const URI = getHostURI
    const scenes = await fetch(`${URI}${API_ROUTES.listScenes()}`).then(res => res.json())
    commit('setListScenes', scenes.data)
  },

  setExperienceDone({ commit }, { experienceName, sceneName }) {
    commit('setExperienceDone', { experienceName, sceneName })
  }
}
