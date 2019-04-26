import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const PRODUCTION_MODE = process.env.NODE_ENV === 'production'

const vuexLocal = new VuexPersistence({
  storage: localforage,
  asyncStorage: true,
  key: 'webexpe-state',
  strictMode: !PRODUCTION_MODE
})

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    RESTORE_MUTATION: !PRODUCTION_MODE ? vuexLocal.RESTORE_MUTATION : undefined,
    ...mutations
  },
  actions,
  strict: !PRODUCTION_MODE,
  plugins: [vuexLocal.plugin]
})
