<template>
  <v-app :dark="darkMode">
    <div v-if="!loadingMessage && isGdprValidated && isHostConfigured">
      <ResetAppMenu ref="resetApp" />

      <!-- DISABLE : This part is commented to disable view of menu when starting scene experiment -->
      <!-- Sidebar menu -->
      <!--<v-navigation-drawer
        v-model="drawer"
        clipped
        fixed
        app
      >
        <v-list dense>
          <v-list-tile to="/experiments" exact>
            <v-list-tile-action>
              <v-icon>library_books</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>List of experiments</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/linkGenerator" exact>
            <v-list-tile-action>
              <v-icon>share</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Link generator</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-fade-transition>
            <v-list-tile v-if="showResetAppInMenu" @click="$refs.resetApp.show(), drawer = false">
              <v-list-tile-action>
                <v-icon>refresh</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Application reset menu</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-fade-transition>
        </v-list>
      </v-navigation-drawer>-->
      <!--/ Sidebar menu -->

      <!-- Top bar -->
      <!-- <v-toolbar app fixed clipped-left>
        <v-toolbar-side-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title @click="showResetAppInMenu = !showResetAppInMenu">SIN3D</v-toolbar-title>
      </v-toolbar> -->
      <!--/ Top bar -->
    </div>

    <!-- Pages content -->
    <v-content>
      <v-container fill-height>
        <v-layout justify-center>
          <v-flex xs12>
            <v-scroll-x-reverse-transition mode="out-in">
              <!-- View injected here -->
              <router-view />
              <!--/ View injected here -->
            </v-scroll-x-reverse-transition>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <!--/ Pages content -->
  </v-app>
</template>

<script>
import './style.css'
import ResetAppMenu from '@/components/ResetAppMenu.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ResetAppMenu
  },
  data() {
    return {
      darkMode: true,
      drawer: false,
      showResetAppInMenu: false,

      loadingErrorMessage: null,
      loadingMessage: null
    }
  },
  computed: {
    ...mapGetters(['isGdprValidated', 'isHostConfigured', 'areScenesLoaded'])
  },
  watch: {
    isGdprValidated(isValidated) {
      if (isValidated) this.APP_LOADER()
    },
    isHostConfigured(isConfigured) {
      if (isConfigured) this.APP_LOADER()
    },
    areScenesLoaded(areLoaded) {
      if (areLoaded) this.APP_LOADER()
    }
  },
  mounted() {
    this.APP_LOADER()
  },
  methods: {
    ...mapActions(['loadScenesList']),

    // Main app function that redirect the user where he needs to be at
    async APP_LOADER() {
      if (this.isGdprValidated && this.isHostConfigured) {
        if (!this.areScenesLoaded) await this.load(this.loadScenesList, 'Loading scenes list...')
      }
    },

    async load(fn, loadingMessage) {
      try {
        this.loadingMessage = loadingMessage
        await fn()
      }
      catch (err) {
        console.error(err)
        this.loadingErrorMessage = err.message
        return
      }
      finally {
        this.loadingMessage = null
      }
    }

  }
}
</script>
