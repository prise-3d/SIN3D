<template>
  <ExperimentBlock
    :experiment-name="experimentName"
    :scene-name="sceneName"
    :loading-message="loadingMessage"
    :loading-error-message="loadingErrorMessage"
  >
    <template v-slot:header>
      <!-- Extract configuration -->
      <extract-configuration
        v-if="lockConfig === false"
        @setExtractConfig="setExtractConfig($event, $refs.configurator)"
        :loading-error-message="loadingErrorMessage"
        ref="configurator"
      />
      <!--/ Extract configuration -->
    </template>

    <template v-slot:content>
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
                    <div v-if="anExtract.loading" class="img-extract-loader" @click.right.prevent>
                      <v-progress-circular :indeterminate="true" />
                    </div>
                    <v-img
                      v-else
                      :src="anExtract.link"
                      @click.left.prevent="extractAction($event, anExtract)"
                      @click.right.prevent="extractAction($event, anExtract)"
                      class="cursor"
                      :class="{ 'extract-hover-border': showHoverBorder === true }"
                    >
                      <template v-slot:placeholder>
                        <v-layout fill-height align-center justify-center ma-0>
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

          <v-container v-if="referenceExtracts" class="pa-1">
            <template v-for="i in extractConfig.y">
              <v-layout row wrap :key="`row-${i}`">
                <v-flex
                  v-for="(anExtract, index) in referenceExtracts.slice(extractConfig.x * (i - 1), (extractConfig.x * i))"
                  :key="`reference-extract-${i}-${extractConfig.x}-${extractConfig.y}-${index}-${anExtract.quality}`"
                  class="pa-0"
                >
                  <v-card flat tile class="d-flex height100">
                    <v-img :src="anExtract.link">
                      <template v-slot:placeholder>
                        <v-layout fill-height align-center justify-center ma-0>
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
      <!-- Experiment validation button -->
      <v-layout justify-end align-content-end>
        <v-btn @click="finishExperiment" color="primary" large right>Finish experiment</v-btn>
      </v-layout>
      <!--/ Experiment validation button -->
    </template>
  </ExperimentBlock>
</template>

<script>
import ExperimentBlock from '@/components/ExperimentBlock.vue'
import ExperimentBaseExtracts from '@/mixins/ExperimentBaseExtracts'
import ExtractConfiguration from '@/components/ExperimentsComponents/ExtractConfiguration.vue'
import { API_ROUTES, shuffleArray } from '@/functions'

export default {
  components: {
    ExperimentBlock,
    ExtractConfiguration
  },
  mixins: [ExperimentBaseExtracts],

  data() {
    return {
      referenceExtracts: null,
      extractsIndices: null
    }
  },

  async mounted() {
    // Load config for this scene to local state
    this.loadConfig()

    // Load progress from store into local state
    this.loadProgress()

    // Load scene data from the API

    if (this.qualities === null) {
      const URI = `${this.getHostURI}${API_ROUTES.listSceneQualities(
        this.sceneName
      )}`
      const { data } = await fetch(URI).then(res => res.json())
      this.qualities = data

      // remove reference
      this.qualities.pop()
    }

    // Load the cached configuration in the configurator component
    if (this.lockConfig === false)
      this.$refs.configurator.setDefaultConfig(this.extractConfig)

    // Load extracts if none were cached
    if (this.extracts.length === 0)
      await this.setExtractConfig(this.extractConfig, this.$refs.configurator)

    // if no cache let random shuffle extract zone
    if (this.extractsIndices === null) {
      let indices = [
        ...Array(this.extractConfig.x * this.extractConfig.y).keys()
      ]
      this.extractsIndices = shuffleArray(indices)

      // get extract for reference image
      const data = await this.getExtracts('max')

      this.referenceExtracts = data.extracts.map((url, i) => ({
        link: url,
        quality: data.info.image.quality,
        zone: i + 1,
        index: i
      }))

      // reorder extracts following random indices
      let referenceExtractsRandom = []
      let extractsRandom = []

      for (const [i, index] of this.extractsIndices.entries()) {
        referenceExtractsRandom.push(this.referenceExtracts[index])
        extractsRandom.push(this.extracts[index])
        extractsRandom[i].index = i
      }

      this.referenceExtracts = referenceExtractsRandom
      this.extracts = extractsRandom
    }

    this.saveProgress()
  }
}
</script>
