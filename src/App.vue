<template>
  <v-app :dark="darkMode">
    <!-- Application cache reset button -->
    <div class="reset-button">
      <ResetAppButton />
    </div>
    <!--/ Application cache reset button -->

    <div v-if="!loadingMessage && isGdprValidated && isHostConfigured">
      <!-- Sidebar menu -->
      <v-navigation-drawer
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

          <v-list-tile @click="loadScenesHard">
            <v-list-tile-action>
              <v-icon>refresh</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Refresh list of scenes</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <!--/ Sidebar menu -->

      <!-- Top bar -->
      <v-toolbar app fixed clipped-left>
        <v-toolbar-side-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>SIN3D</v-toolbar-title>
      </v-toolbar>
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
import ResetAppButton from '@/components/ResetAppButton.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ResetAppButton
  },
  data() {
    return {
      darkMode: true,
      drawer: false,

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
        if (!this.areScenesLoaded) await this.loadScenes()
      }
    },

    loadScenes() {
      return this.load(this.loadScenesList, 'Loading scenes list...')
    },

    async loadScenesHard() {
      await this.loadScenes()
      this.$router.go()
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

<style scoped>
.reset-button {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
