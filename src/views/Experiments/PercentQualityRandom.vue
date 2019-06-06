<template>
  <ExperimentBlock
    :experiment-name="experimentName"
    :scene-name="sceneName"
    :loading-message="loadingMessage"
    :loading-error-message="loadingErrorMessage"
  >
    <template v-slot:header>
      <!-- ## Template to place in the header (example: Extract-configurator) ## -->
    </template>

    <template v-slot:content>
      <!-- ## Actual experiment template ## -->

      <!-- Image -->
      <v-flex xs12 sm6 offset-sm3>
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
      <!--/ Image -->

      <!-- Quality Slider -->
      <v-flex xs12>
        <v-subheader class="pl-0">Mark from 0 to 100 how high you think the quality is</v-subheader>
        <v-slider
          v-model="selectedQuality"
          thumb-label
        />
      </v-flex>
      <!--/ Quality Slider -->


      <!-- Experiment validation button -->
      <v-layout justify-center align-content-center>
        <div id="choice">
          <v-container grid-list-md text-xs-center fluid>
            <h2>Test {{ testCount }} / {{ maxTestCount }}</h2>
            <v-layout row wrap>
              <v-flex sm12 xs12>
                <v-btn @click="nextRandomImage" color="primary" large>Validate quality</v-btn>
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
import ExperimentBase from '@/mixins/ExperimentBase.vue'
import { EXPERIMENT as experimentMsgId } from '@/../config.messagesId'
import { rand } from '@/functions'

export default {
  name: 'PercentQualityRandom', // experiment filename
  components: {
    ExperimentBlock
  },
  mixins: [ExperimentBase],
  data() {
    return {
      experimentName: 'PercentQualityRandom', // experiment filename
      image1: null,
      selectedQuality: 50,
      testCount: 1,
      maxTestCount: 10
    }
  },

  // When experiment is loaded, this function is ran
  async mounted() {
    // Load config and progress for this scene to local state
    this.loadConfig()
    this.loadProgress()

    // ## Do your experiment initialization stuff here ##
    this.loadingMessage = 'Loading experiment data...'
    this.loadingErrorMessage = null
    try {
      // Load scene qualities list
      await this.getQualitiesList()

      if (!this.image1) await this.getTest()
    }
    catch (err) {
      console.error(err)
      this.loadingErrorMessage = err.message
      return
    }
    finally {
      this.loadingMessage = null
    }
    // ##/ Do your experiment initialization stuff here ##

    // Save progress from local state into store
    this.saveProgress()
  },

  // List of experiment-specific methods
  methods: {
    // load image
    async getTest() {
      let randomQuality = this.qualities[rand(0, this.qualities.length - 1)]
      this.image1 = await this.getImage(randomQuality)
      this.selectedQuality = 50
    },

    async nextRandomImage() {
      this.loadingMessage = 'Loading new test...'
      this.loadingErrorMessage = null
      try {
        this.testCount++

        const experimentalData = {
          image1: this.image1,
          selectedQuality: this.selectedQuality,
          experimentName: this.experimentName,
          sceneName: this.sceneName
        }
        this.sendMessage({ msgId: experimentMsgId.DATA, msg: experimentalData })

        // Experiment end
        if (this.testCount > this.maxTestCount) return this.finishExperiment()

        await this.getTest()
      }
      catch (err) {
        console.error('Failed to load new test', err)
        this.loadingErrorMessage = 'Failed to load new test. ' + err.message
      }
      finally {
        this.loadingMessage = null
        this.saveProgress()
      }
    }
  }
}
</script>


<style scoped>
/* Experiment-specific style (CSS) */
</style>
