import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueNativeSock from 'vue-native-websocket'

Vue.config.productionTip = false

Vue.use(VueNativeSock, 'ws://example.com', {
  store,
  connectManually: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
})
store.$socket = Vue.prototype.$socket

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
