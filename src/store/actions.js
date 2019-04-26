// import { delay } from '../functions'

export default {
  async increment({ commit }, amount = 1) {
    commit('increment', amount)
  },

  async decrement({ commit }, amount = 1) {
    commit('increment', -amount)
  }
}
