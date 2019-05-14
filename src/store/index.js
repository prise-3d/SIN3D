import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import defaultState from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'webexpe-state',
  reducer: state => ({
    uuid: state.uuid,
    gdprConsent: state.gdprConsent,
    hostConfig: state.hostConfig,
    scenesList: state.scenesList,
    progression: state.progression
  })
})

export default new Vuex.Store({
  state: defaultState(),
  getters,
  mutations,
  actions,
  plugins: [vuexLocal.plugin]
})
