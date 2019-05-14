import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueNativeSock from 'vue-native-websocket'

Vue.config.productionTip = false

// Connect the WebSocket client to the store
Vue.use(VueNativeSock, 'ws://example.com', {
  store,
  connectManually: true,
  reconnection: true,
  reconnectionAttempts: 2,
  reconnectionDelay: 1000
})
store.$socket = Vue.prototype.$socket

// A function loaded before each route change
router.beforeEach((to, from, next) => {
  // Redirect from config pages if already configured
  if (to.path === '/gdpr' && store.getters.isGdprValidated)
    return next('/hostConfig')

  if (to.path === '/hostConfig' && store.getters.isHostConfigured)
    return next('/experiments')


  // Redirect to configuration pages
  // Check GDPR before doing anything and redirect if necessary
  if (!store.getters.isGdprValidated) {
    if (to.path !== '/gdpr') return next('/gdpr')
    return next()
  }

  // Identify the user
  store.dispatch('setAppUniqueId')

  // Redirect if the host is not configured
  if (!store.getters.isHostConfigured) {
    if (to.path !== '/hostConfig')
      return next('/hostConfig')
    return next()
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
