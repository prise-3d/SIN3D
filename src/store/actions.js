import { delay } from '../functions'

export default {
  async increment({ commit }) {
    commit('increment')
  },

  async decrement({ commit }) {
    commit('decrement')
  }
}
