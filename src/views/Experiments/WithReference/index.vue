<template>
  <div>
    <v-container grid-list-md text-xs-center fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-layout justify-start>
            <v-btn flat exact :to="`/experiments/${experimentName}`">
              <v-icon left>arrow_back</v-icon>
              Back to scene selection
            </v-btn>
          </v-layout>

          <h1>Experiment with reference - {{ sceneName }}</h1>
          <!-- Extract configuration -->
          <extract-configuration @setConfig="setConfig($event, $refs.configurator)" :loading-error-message="loadingErrorMessage" ref="configurator" />
          <!--/ Extract configuration -->
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
                <template v-for="i in extractConfig.y">
                  <v-layout row wrap :key="`row-${i}`">
                    <v-flex
                      v-for="(anExtract, index) in extracts.slice(extractConfig.x * (i - 1), (extractConfig.x * i))"
                      :key="`extract-${i}-${extractConfig.x}-${extractConfig.y}-${index}-${anExtract.quality}`"
                      class="pa-0"
                    >
                      <v-card flat tile class="d-flex height100">
                        <div
                          v-if="anExtract.loading"
                          class="img-extract-loader"
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
          <!-- Experiment validation button -->
          <v-layout justify-end align-content-end>
            <v-btn @click="finishExperiment" color="primary" large right>Finish experiment</v-btn>
          </v-layout>
          <!--/ Experiment validation button -->
        </template>
        <!--/ Experiment -->
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ExperimentBaseExtracts from '@/mixins/ExperimentBaseExtracts'
import { API_ROUTES } from '@/functions'
import Loader from '@/components/Loader.vue'
import ExtractConfiguration from '@/components/ExperimentsComponents/ExtractConfiguration.vue'
import getSceneConfig from './config'

export default {
  name: 'ExperimentWithReference',
  components: {
    Loader,
    ExtractConfiguration
  },
  mixins: [ExperimentBaseExtracts],

  data() {
    return {
      experimentName: 'ExperimentWithReference',
      referenceImage: null
    }
  },

  async mounted() {
    // Load progress from store into local state
    this.loadProgress()

    // Load scene data from the API
    await Promise.all([
      this.getReferenceImage(),
      this.getQualitiesList()
    ])

    // Load the cached configuration in the configurator component
    this.$refs.configurator.setDefaultConfig(this.extractConfig)

    // Load extracts of none were cached
    if (this.extracts.length === 0) await this.setConfig(this.extractConfig, this.$refs.configurator)

    this.saveProgress()
  },
  methods: {
    // Load the reference image from the API
    async getReferenceImage() {
      if (this.referenceImage) return

      const URI = `${this.getHostURI}${API_ROUTES.getImage(this.sceneName, 'max')}`
      const { data } = await fetch(URI).then(res => res.json())
      this.referenceImage = this.getHostURI + data.link
      this.saveProgress()
    }
  }
}
</script>

<style scoped>
/* White border when hovering on extracts
 .extract:hover {
  outline: 2px #f4f4f4 solid;
} */
</style>
