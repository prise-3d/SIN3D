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

    <template v-if="reconstructedImage" v-slot:content>
      <!-- ## Actual experiment template ## -->

      <!-- Image -->
      <v-flex xs12 sm6 offset-sm3>
        <v-card dark color="primary">
          <v-card-text class="px-0">Reconstructed image</v-card-text>
          <v-container class="pa-1">
            <ExtractsToImage :extracts="reconstructedImage" :extract-config="extractConfig" />
          </v-container>
        </v-card>
      </v-flex>
      <!--/ Image -->

      <!-- Experiment validation button -->
      <v-layout justify-center align-content-center>
        <div id="choice">
          <v-container grid-list-md text-xs-center fluid>
            <h2>Test {{ testCount }} / {{ maxTestCount }}</h2>
            <v-layout row wrap>
              <v-flex sm6 xs12>
                <v-btn @click="nextReconstructedImage(false)" color="error" large>Images is NOT correct</v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn @click="nextReconstructedImage(true)" color="success" large>Images is correct</v-btn>
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
import ExperimentBaseExtracts from '@/mixins/ExperimentBaseExtracts'
import ExtractsToImage from '@/components/ExperimentsComponents/ExtractsToImage'
import { EXPERIMENT as experimentMsgId } from '@/../config.messagesId'
import { rand } from '@/functions'

export default {
  name: 'IsImageCorrect', // experiment filename
  components: {
    ExperimentBlock,
    ExtractsToImage
  },
  mixins: [
    ExperimentBaseExtracts
  ],
  data() {
    return {
      experimentName: 'IsImageCorrect', // experiment filename
      refImage: null,
      randImage: null,
      reconstructedImage: null,
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

      if (!this.reconstructedImage) await this.getReconstructedImage()
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
    // load reconstructed image
    async getReconstructedImage() {
      const randomQuality = this.qualities[rand(0, this.qualities.length - 1)]
      const maxQuality = this.qualities[this.qualities.length - 1]

      // Get the reference image, extracts of reference image and random quality extracts
      const [maxExtracts, randomExtracts, maxImage, randImage] = await Promise.all([
        this.getExtracts('max'),
        this.getExtracts(randomQuality),
        this.getImage(maxQuality),
        this.getImage(randomQuality)
      ])

      this.refImage = maxImage
      this.randImage = randImage

      // get part to keep into refImage
      let position = rand(0, 1)
      this.refPosition = position ? 'left' : 'right'

      // construct new image with two different parts
      maxExtracts.extracts[position] = randomExtracts.extracts[position]
      this.reconstructedImage = maxExtracts.extracts
    },

    // get next reconstructed image
    async nextReconstructedImage(correct) {
      this.loadingMessage = 'Loading new test...'
      this.loadingErrorMessage = null
      try {
        this.testCount++

        const experimentalData = {
          refImage: this.refImage,
          randImage: this.randImage,
          refPosition: this.refPosition,
          imageCorrect: correct,
          stepCounter: this.testCount,
          maxStepCount: this.maxTestCount,
          experimentName: this.experimentName,
          sceneName: this.sceneName
        }
        this.sendMessage({ msgId: experimentMsgId.DATA, msg: experimentalData })

        // Experiment end
        if (this.testCount > this.maxTestCount) return this.finishExperiment()

        await this.getReconstructedImage()
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
