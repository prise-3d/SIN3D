<template>
  <div>
    <v-container grid-list-md text-xs-center fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <h1>Experiment with reference</h1>
          <v-card dark>
            <v-container grid-list-sm fluid>
              <v-layout row wrap>
                <v-flex
                  xs12
                >
                  <h1>Configuration</h1>
                  <v-card-text class="px-0">Extracts per line (horizontal)</v-card-text>
                  <v-slider
                    v-model="experimentConfig.x"
                    always-dirty
                    persistent-hint
                    thumb-label="always"
                    min="1"
                    max="25"
                  />

                  <v-card-text class="px-0">Extracts per row (vertical)</v-card-text>
                  <v-slider
                    v-model="experimentConfig.y"
                    always-dirty
                    persistent-hint
                    thumb-label="always"
                    min="1"
                    max="25"
                  />

                  <v-btn @click="setConfig" :disabled="!isConfigNew">Confirm</v-btn>

                  <v-alert v-if="loadingErrorMessage" :value="true" type="error" v-text="loadingErrorMessage" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <!-- Loading screen -->
        <loader v-if="loadingMessage" :message="loadingMessage" />
        <!--/ Loading screen -->

        <!-- Experiment -->
        <template v-else-if="!loadingErrorMessage">
          <v-flex xs12 sm6>
            <v-card dark color="primary">
              <v-card-text class="px-0">Experiment image</v-card-text>

              <v-container class="pa-1">
                <template v-for="i in extractConfig.x">
                  <v-layout row wrap :key="`row-${i}`">
                    <v-flex
                      v-for="(anExtract, index) in extracts.slice(extractConfig.x * (i - 1), (extractConfig.x * i))"
                      :key="`extract-${i}-${extractConfig.x}-${extractConfig.y}-${index}-${anExtract.quality}`"
                      class="pa-0"
                    >
                      <v-card flat tile class="d-flex height100">
                        <div
                          v-if="anExtract.loading"
                          class="img-loader"
                          @click.right.prevent
                        >
                          <v-progress-circular
                            :indeterminate="true"
                          />
                        </div>
                        <v-img
                          v-else
                          :src="anExtract.link"
                          @click.left.prevent="extractAction($event, anExtract)"
                          @click.right.prevent="extractAction($event, anExtract)"
                          class="cursor extract"
                        >
                          <template v-slot:placeholder>
                            <v-layout
                              fill-height
                              align-center
                              justify-center
                              ma-0
                            >
                              <v-progress-circular indeterminate color="grey lighten-5" />
                            </v-layout>
                          </template>
                        </v-img>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </template>
              </v-container>
            </v-card>
          </v-flex>
          <v-flex sm6 xs12>
            <v-card dark color="primary">
              <v-card-text>Reference image</v-card-text>
              <v-img v-if="referenceImage" :src="referenceImage" />
            </v-card>
          </v-flex>
        </template>
      <!--/ Experiment -->
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { API_ROUTES, findNearestUpper, findNearestLower } from '@/functions'
import Loader from '@/components/Loader.vue'

export default {
  name: 'ExperimentWithReference',
  components: {
    Loader
  },
  props: {
    sceneId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      referenceImage: null,
      qualities: null,

      experimentConfig: { // Experiment config sliders
        x: 8,
        y: 4,
        error: null
      },
      extractConfig: { // Updated when `setConfig` is called
        x: 8,
        y: 4
      },
      loadingMessage: null,
      loadingErrorMessage: null,
      extracts: []
    }
  },
  computed: {
    ...mapGetters(['getHostURI']),
    isConfigNew() {
      return this.extractConfig.x !== this.experimentConfig.x || this.extractConfig.y !== this.experimentConfig.y
    }
  },

  async mounted() {
    await this.getReferenceImage()
    await this.getQualitiesList()

    // Get default extracts : min quality, cut config : x = 4, y = 4
    await this.setConfig()
  },
  methods: {
    ...mapActions([]),

    async getReferenceImage() {
      const URI = `${this.getHostURI}${API_ROUTES.getImage(this.sceneId, 'max')}`
      const { data } = await fetch(URI).then(res => res.json())
      this.referenceImage = this.getHostURI + data.link
    },

    async getQualitiesList() {
      const URI = `${this.getHostURI}${API_ROUTES.listSceneQualities(this.sceneId)}`
      const { data } = await fetch(URI).then(res => res.json())
      this.qualities = data
    },

    async getExtracts(quality = 'max') {
      const URI = `${this.getHostURI}${API_ROUTES.getImageExtracts(this.sceneId, quality, this.extractConfig.x, this.extractConfig.y)}`
      const { data } = await fetch(URI)
        .then(async res => {
          res.json = await res.json()
          return res
        })
        .then(res => {
          if (!res.ok) throw new Error(res.json.message + res.json.data ? `\n${res.json.data}` : '')
          return res.json
        })
      return data
    },

    async setConfig() {
      // Check if the config is the same
      if (this.extracts.length > 0 && !this.isConfigNew) return

      this.loadingMessage = 'Loading configuration extracts...'
      this.loadingErrorMessage = null
      try {
        this.extractConfig.x = this.experimentConfig.x
        this.extractConfig.y = this.experimentConfig.y
        const data = await this.getExtracts()
        const hostURI = this.getHostURI
        this.extracts = data.extracts.map((url, i) => ({
          link: hostURI + url,
          quality: data.info.image.quality,
          zone: i + 1,
          index: i,
          nextQuality: findNearestUpper(data.info.image.quality, this.qualities),
          precQuality: findNearestLower(data.info.image.quality, this.qualities),
          loading: false
        }))
      }
      catch (err) {
        console.error('Failed to load new configuration', err)
        this.loadingErrorMessage = 'Failed to load new configuration. ' + err.message
      }
      this.loadingMessage = null
    },

    async extractAction(event, extractObj) {
      console.log(event, extractObj)
      const { index, nextQuality, precQuality, quality } = extractObj

      let newQuality
      if (event.button === 0) newQuality = precQuality // Left click
      if (event.button === 2) newQuality = nextQuality // Right click

      // Do not load a new extract if same quality
      if (newQuality === quality) return

      // Set loading state
      this.extracts[index].loading = true
      try {
        // Loading new extract
        const data = await this.getExtracts(newQuality)
        this.extracts[index].link = this.getHostURI + data.extracts[index]
        this.extracts[index].quality = data.info.image.quality
        this.extracts[index].nextQuality = findNearestUpper(data.info.image.quality, this.qualities)
        this.extracts[index].precQuality = findNearestLower(data.info.image.quality, this.qualities)
        this.extracts[index].loading = false
      }
      catch (err) {
        // TODO: toast message if fail
        console.error('Failed to load extract', err)
      }
      finally {
        this.extracts[index].loading = false
      }
    }
  }
}
</script>

<style scoped>
.height100 {
  height: 100%;
}
.img-loader {
  height: 100%;
  width: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cursor {
  cursor: pointer;
}
.extract:hover {
  z-index: 999999;
  outline: 2px #f4f4f4 solid;
}
</style>
