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

          <h2>Experiment "{{ $route.meta.fullName }}"</h2>
          <h3>{{ sceneName }}</h3>
        </v-flex>
        <!-- Loading screen -->
        <loader v-if="loadingMessage" :message="loadingMessage" />
        <!--/ Loading screen -->

        <!-- Experiment -->
        <template v-else-if="!loadingErrorMessage && image1 && image2">
          <v-flex xs12 sm6>
            <v-card dark color="primary">
              <v-card-text class="px-0">Image 1</v-card-text>

              <v-container v-if="imageOneExtractPosition === 'left'" class="pa-1">
                <ExtractsToImage :extracts="image1" :extract-config="extractConfig" />
              </v-container>
              <v-img v-else :src="image2.link" @load="scrollToChoiceButtons">
                <template v-slot:placeholder>
                  <v-layout fill-height align-center justify-center ma-0>
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-layout>
                </template>
              </v-img>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6>
            <v-card dark color="primary">
              <v-card-text>Image 2</v-card-text>
              <v-container v-if="imageOneExtractPosition === 'right'" class="pa-1">
                <ExtractsToImage :extracts="image1" :extract-config="extractConfig" />
              </v-container>
              <v-img v-else :src="image2.link" @load="scrollToChoiceButtons">
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
                    <v-btn @click="areTheSameActionLocal(false)" color="error" large>Images are NOT the same</v-btn>
                  </v-flex>
                  <v-flex sm6 xs12>
                    <v-btn @click="areTheSameActionLocal(true)" color="success" large>Images are the same</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
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
import ExperimentBaseExtracts from '@/mixins/ExperimentBaseExtracts'
import ExperimentBaseAreSameImages from '@/mixins/ExperimentBaseAreSameImages'
import Loader from '@/components/Loader'
import ExtractsToImage from '@/components/ExperimentsComponents/ExtractsToImage'
import { rand } from '@/functions'

export default {
  name: 'AreSameImagesReferenceOneExtract',
  components: {
    Loader,
    ExtractsToImage
  },
  mixins: [
    ExperimentBaseExtracts,
    ExperimentBaseAreSameImages
  ],

  data() {
    return {
      experimentName: 'AreSameImagesReferenceOneExtract',

      imageOneExtractPosition: null,
      randomZoneIndex: null,
      randomZoneQuality: null
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
    if (!this.image1 || !this.image2) {
      const { image1, image2 } = await this.getReferenceOneExtractTest()
      this.image1 = image1
      this.image2 = image2
    }

    this.saveProgress()
  },

  methods: {
    // Get a test with one random quality and a reference
    async getReferenceOneExtractTest() {
      // Randomly choose a quality for the extract
      const randomQuality = this.qualities[rand(0, this.qualities.length - 1)]

      const maxQuality = this.qualities[this.qualities.length - 1]

      // Get the reference image, extracts of reference image and random quality extracts
      const [maxExtracts, randomExtracts, maxImage] = await Promise.all([
        this.getExtracts('max'),
        this.getExtracts(randomQuality),
        this.getImage(maxQuality)
      ])

      // Select which zone is the random extract (-1 to get array index)
      const randomZoneIndex = rand(0, maxExtracts.extracts.length - 1)
      // Apply the random quality extract
      maxExtracts.extracts[randomZoneIndex] = randomExtracts.extracts[randomZoneIndex]

      // Fix uris
      const referenceWithOneExtract = maxExtracts.extracts.map(url => this.getHostURI + url)
      maxImage.link = this.getHostURI + maxImage.link

      // Backup test data
      this.randomZoneIndex = randomZoneIndex
      this.randomZoneQuality = randomQuality
      this.imageOneExtractPosition = rand(0, 1) === 0 ? 'left' : 'right'

      return {
        image1: referenceWithOneExtract,
        image2: maxImage
      }
    },

    areTheSameActionLocal(areTheSame) {
      const additionalData = {
        imageOneExtractPosition: this.imageOneExtractPosition,
        randomZoneIndex: this.randomZoneIndex,
        randomZone: this.randomZoneIndex + 1,
        randomZoneQuality: this.randomZoneQuality
      }
      this.areTheSameAction(areTheSame, this.getReferenceOneExtractTest, additionalData)
    }
  }
}
</script>
