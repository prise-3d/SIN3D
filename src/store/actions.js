import Vue from 'vue'
import router from '../router'
import { API_ROUTES, buildURI, buildWsURI, delay, serialize } from '../functions'

export default {
  setGdprValidated({ state, commit }) {
    if (!state.gdprConsent) {
      commit('setGdprValidated')
      router.push('/hostConfig')
    }
  },

  setAppUniqueId({ state, commit }) {
    if (!state.uuid) commit('setAppUniqueId')
  },

  resetApp({ commit }, { gdprConsent = false, hostConfig = false, progression = false }) {
    commit('resetApp', { gdprConsent, hostConfig, progression })
  },

  async setHostConfig({ state, commit, dispatch }, { ssl, host, port }) {
    // Timeout after 1s
    const controller = new AbortController()
    const signal = controller.signal
    setTimeout(() => controller.abort(), 1500)

    const URI = buildURI(ssl, host, port, API_ROUTES.ping())
    return fetch(URI, { signal })
      .then(async res => {
        if (res.status !== 200) throw new Error(`Received wrong HTTP status code : ${res.status} (Need 200).`)

        const content = await res.text()
        if (content !== 'pong') throw new Error('Received wrong web content (Need to receive "pong").')

        this._vm.$connect(buildWsURI(ssl, host, port))

        // $connect does not return a Promise, so we wait to know if it worked
        await delay(300)
        if (!state.socket.isConnected)
          throw new Error('Could not connect to remote WebSocket server.')


        // Configuration is valid
        commit('setHostConfig', { ssl, host, port })
        router.push('/experiments')
        dispatch('collectUserData')
      })
      .catch(err => {
        // Host not reachable or invalid HTTP status code
        throw new Error(`Invalid configuration "${URI}". ${!err.message.includes('aborted') ? err.message : ''}`)
      })
  },

  async connectToWs({ state, getters }) {
    if (state.socket.isConnected) return /*eslint-disable-line */
    else if (getters.isHostConfigured) {
      this._vm.$connect(getters.getHostWsURI)
      // $connect does not return a Promise, so we wait to know if it worked
      await delay(300)
      if (!state.socket.isConnected)
        throw new Error('Could not connect to remote WebSocket server.')
    }
    else throw new Error('Could not connect to WebSocket server. Host is not configured.')
  },

  async collectUserData({ state, getters }) {
    let screen = serialize(window.screen)
    screen.orientation = serialize(window.screen.orientation)

    return fetch(getters.getHostURI + API_ROUTES.dataCollect(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid: state.uuid,
        screen
      })
    })
  },

  sendMessage({ state }, { msgId, msg = undefined }) {
    Vue.prototype.$socket.send(JSON.stringify({ uuid: state.uuid, msgId, msg }))
  },

  async loadScenesList({ getters: { isHostConfigured, getHostURI }, commit }) {
    if (!isHostConfigured) throw new Error('Host is not configured.')

    const URI = getHostURI
    const scenes = await fetch(`${URI}${API_ROUTES.listScenes()}`).then(res => res.json())
    commit('setListScenes', scenes.data)
  },

  setExperimentProgress({ commit }, { experimentName, sceneName, data }) {
    commit('setExperimentProgress', { experimentName, sceneName, data })
  },
  setExperimentDone({ commit }, { experimentName, sceneName, done = true }) {
    commit('setExperimentDone', { experimentName, sceneName, done })
  }
}
