import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const PRODUCTION_MODE = process.env.NODE_ENV === 'production'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'webexpe-state',
  strictMode: !PRODUCTION_MODE
})

export default new Vuex.Store({
  state,
  getters,
  mutations: {
    RESTORE_MUTATION: !PRODUCTION_MODE ? vuexLocal.RESTORE_MUTATION : undefined,
    ...mutations
  },
  actions,
  strict: !PRODUCTION_MODE,
  plugins: [vuexLocal.plugin]
})
