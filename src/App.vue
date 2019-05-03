<template>
  <v-app :dark="darkMode">
    <!-- Application cache reset button -->
    <div class="reset-button">
      <ResetAppButton />
    </div>
    <!--/ Application cache reset button -->

    <v-slide-y-transition mode="out-in">
      <!-- Loading screen -->
      <loader v-if="loadingMessage" :message="loadingMessage" />
      <!--/ Loading screen -->

      <!-- Host connection configuration -->
      <host-config v-else-if="!isHostConfigured" />
      <!--/ Host connection configuration -->


      <div v-else>
        <!-- Sidebar menu -->
        <v-navigation-drawer
          v-model="drawer"
          clipped
          fixed
          app
        >
          <v-list dense>
            <v-list-tile to="/experimentsList" exact>
              <v-list-tile-action>
                <v-icon>library_books</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>List of experiments</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="loadScenes">
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
          <v-toolbar-title>Web experiment</v-toolbar-title>
        </v-toolbar>
        <!--/ Top bar -->

        <!-- Pages content -->
        <v-content>
          <v-container fill-height>
            <v-layout justify-center>
              <v-scroll-x-reverse-transition mode="out-in">
                <!-- View injected here -->
                <router-view />
                <!--/ View injected here -->
              </v-scroll-x-reverse-transition>
            </v-layout>
          </v-container>
        </v-content>
        <!--/ Pages content -->
      </div>
    </v-slide-y-transition>
  </v-app>
</template>

<script>
import ResetAppButton from '@/components/ResetAppButton.vue'
import Loader from '@/components/Loader.vue'
import HostConfig from '@/components/HostConfig.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ResetAppButton,
    Loader,
    HostConfig
  },
  data() {
    return {
      darkMode: true,
      drawer: false,

      hostConfigured: false,

      loadingErrorMessage: null,
      loadingMessage: null
    }
  },
  computed: {
    ...mapGetters(['isHostConfigured', 'areScenesLoaded'])
  },
  watch: {
    isHostConfigured(value) {
      if (!this.areScenesLoaded && value) this.loadAppData()
    }
  },
  mounted() {
    if (this.isHostConfigured && !this.areScenesLoaded) this.loadAppData()
  },
  methods: {
    ...mapActions(['loadScenesList']),
    async loadAppData() {
      if (this.isHostConfigured && !this.areScenesLoaded) {
        await this.loadScenes()
      }
    },

    async loadScenes() {
      this.loadingMessage = 'Loading scenes list...'
      try {
        await this.loadScenesList()
      }
      catch (err) {
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
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>
