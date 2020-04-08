import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// A function loaded before each route change
router.beforeEach((to, from, next) => {
  // Check if there is a special query in the URI
  if (to.query.q) {
    store.commit('setCustomLinkData', to.query.q)
    // GDPR notice not approved
    if (!store.getters.isGdprValidated) {
      if (to.name !== 'GdprNotice') return next('/gdpr')
    }
    return next('/experiments')
  }
  if (store.getters.isGdprValidated && store.state.customLinkData) {
    const request = JSON.parse(JSON.stringify(store.state.customLinkData)) // DEEP COPY
    store.commit('clearCustomLinkData')

    // Identify the user
    store.dispatch('setAppUniqueId')

    // Set the host configuration
    store.commit('setHostConfig', request.hostConfig)

    // Set the userId and experimentId (to explicitly identify the user)
    store.commit('setUserExperimentId', { userId: request.userId, experimentId: request.experimentId })

    // update experiment progress due to perhaps new ids
    store.commit('updateExperimentProgress')

    // Redirect to the experiment scene selector (or directly to a scene if specified)
    if (request.experimentName) {
      if (request.sceneName)
        return next(`/experiments/${request.experimentName}/${request.sceneName}`)
      return next(`/experiments/${request.experimentName}/`)
    }
    return next()
  }

  // Redirect from config pages if already configured
  if (to.name === 'GdprNotice' && store.getters.isGdprValidated)
    return next('/hostConfig')

  if (to.path === '/hostConfig' && store.getters.isHostConfigured)
    return next('/experiments')


  // Redirect to configuration pages
  // Check GDPR before doing anything and redirect if necessary
  if (!store.getters.isGdprValidated) {
    if (to.name !== 'GdprNotice') return next('/gdpr')
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
