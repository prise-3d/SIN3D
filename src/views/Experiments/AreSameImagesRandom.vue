<template>
  <ExperimentBlock
    :experiment-name="experimentName"
    :scene-name="sceneName"
    :loading-message="loadingMessage"
    :loading-error-message="loadingErrorMessage"
  >
    <template v-slot:header></template>
    <template v-slot:content>
      <v-flex xs12 sm6>
        <v-card dark color="primary">
          <v-card-text class="px-0">Image 1</v-card-text>

          <v-img v-if="image1 && image1.link" :src="image1.link">
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

          <v-img v-if="image2 && image2.link" :src="image2.link" @load="scrollToChoiceButtons">
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
        <div id="choice">
          <v-container grid-list-md text-xs-center fluid>
            <h2>Test {{ testCount }} / {{ maxTestCount }}</h2>
            <v-layout row wrap>
              <v-flex sm6 xs12>
                <v-btn @click="nextAction(false)" color="error" large>Images are NOT the same</v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn @click="nextAction(true)" color="success" large>Images are the same</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-layout>
      <!--/ Experiment validation button -->
    </template>
  </ExperimentBlock>
</template>

<script>
import ExperimentBlock from '@/components/ExperimentBlock.vue'
import ExperimentBaseAreTheSame from '@/mixins/ExperimentBaseAreSameImages'

export default {
  name: 'AreSameImagesRandom',
  components: {
    ExperimentBlock
  },
  mixins: [ExperimentBaseAreTheSame],

  data() {
    return {
      experimentName: 'AreSameImagesRandom'
    }
  },

  async mounted() {
    // Load config for this scene to local state
    this.loadConfig()

    // Load progress from store into local state
    this.loadProgress()

    // Load scene data from the API
    await this.getQualitiesList()

    // Load a test if not already one loaded
    if (!this.image1 || !this.image1.link || !this.image2 || !this.image2.link) {
      const { image1, image2 } = await this.getRandomTest()
      this.image1 = image1
      this.image2 = image2
    }

    this.saveProgress()
  },

  methods: {
    // generate next action and save data
    async nextAction(same) {
      let additionalData = {
        stepCounter: this.testCount,
        maxStepCount: this.maxTestCount
      }

      this.areTheSameAction(same, this.getReferenceTest, additionalData)
    }
  }
}
</script>
