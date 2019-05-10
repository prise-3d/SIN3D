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
import ExperimentBaseExtracts from '@/mixins/ExperimentBaseExtracts.vue'
import { API_ROUTES } from '@/functions'
import Loader from '@/components/Loader.vue'

export default {
  name: 'ExperimentWithReference',
  components: {
    Loader
  },
  mixins: [ExperimentBaseExtracts],

  data() {
    return {
      experimentName: 'ExperimentWithReference',
      referenceImage: null
    }
  },
  computed: {

  },

  async mounted() {
    // Load progress from store into local state
    this.loadProgress()

    // Load scene data from the API
    await this.getReferenceImage()
    await this.getQualitiesList()

    // Get default extracts : min quality, cut config : x = 4, y = 4
    await this.setConfig()
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
