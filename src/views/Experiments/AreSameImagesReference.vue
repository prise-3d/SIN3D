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

              <v-img v-if="rightImage && rightImage.link" :src="rightImage.link" @load="scrollToChoiceButtons">
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
                    <v-btn @click="areTheSameAction(false, getReferenceTest)" color="error" large>Images are NOT the same</v-btn>
                  </v-flex>
                  <v-flex sm6 xs12>
                    <v-btn @click="areTheSameAction(true, getReferenceTest)" color="success" large>Images are the same</v-btn>
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
import ExperimentBaseAreSameImages from '@/mixins/ExperimentBaseAreSameImages'
import Loader from '@/components/Loader.vue'

export default {
  name: 'AreSameImagesReference',
  components: {
    Loader
  },
  mixins: [ExperimentBaseAreSameImages],

  data() {
    return {
      experimentName: 'AreSameImagesReference'
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
    if (!this.leftImage || !this.leftImage.link || !this.rightImage || !this.rightImage.link) {
      const { leftImage, rightImage } = await this.getReferenceTest()
      this.leftImage = leftImage
      this.rightImage = rightImage
    }

    this.saveProgress()
  },

  methods: {}
}
</script>
