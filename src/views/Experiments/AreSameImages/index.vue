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

          <h1>Experiment Are the images the same - {{ sceneName }}</h1>
        </v-flex>
        <!-- Loading screen -->
        <loader v-if="loadingMessage" :message="loadingMessage" />
        <!--/ Loading screen -->

        <!-- Experiment -->
        <template v-else-if="!loadingErrorMessage">
          <v-flex xs12 sm6>
            <v-card dark color="primary">
              <v-card-text class="px-0">Image 1</v-card-text>

              <v-img v-if="leftImage && leftImage.link" :src="leftImage.link">
                <template v-slot:placeholder>
                  <v-layout fill-height align-center justify-center ma-0>
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-layout>
                </template>
              </v-img>
            </v-card>
          </v-flex>
          <v-flex sm6 xs12>
            <v-card dark color="primary">
              <v-card-text>Image 2</v-card-text>

              <v-img v-if="rightImage && rightImage.link" :src="rightImage.link">
                <template v-slot:placeholder>
                  <v-layout fill-height align-center justify-center ma-0>
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-layout>
                </template>
              </v-img>
            </v-card>
          </v-flex>


          <!-- Experiment validation button -->

          <v-layout justify-center align-content-center>
            <div>
              <h2>Test {{ testCount }} / {{ maxTestCount }}</h2>
              <v-layout justify-center align-content-center>
                <v-btn @click="areTheSameActionRandom(false)" color="error" large>Images are NOT the same</v-btn>
                <v-btn @click="areTheSameActionRandom(true)" color="success" large>Images are the same</v-btn>
              </v-layout>
            </div>
          </v-layout>
          <!--/ Experiment validation button -->
        </template>
        <!--/ Experiment -->
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ExperimentBaseAreTheSame from '@/mixins/ExperimentBaseAreSameImages'
import Loader from '@/components/Loader.vue'
import experimentConfig from './config'

export default {
  name: 'ExperimentAreTheSame',
  components: {
    Loader
  },
  mixins: [ExperimentBaseAreTheSame],

  data() {
    return {
      experimentName: 'ExperimentAreSameImages'
    }
  },

  async mounted() {
    // Load config for this scene to local state
    await this.loadConfig(experimentConfig)

    // Load progress from store into local state
    this.loadProgress()

    // Load scene data from the API
    await this.getQualitiesList()

    // Load a test if not already one loaded
    if (!this.leftImage || !this.leftImage.link || !this.rightImage || !this.rightImage.link) {
      const { leftImage, rightImage } = await this.getRandomTest()
      this.leftImage = leftImage
      this.rightImage = rightImage
    }

    this.saveProgress()
  },

  methods: {}
}
</script>
