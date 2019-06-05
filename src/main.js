import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

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
