<template>
  <div style="text-align:center">
    <!-- <h2>"{{ experimentFullName }}"</h2> -->

    <!-- <v-card>
      <v-card-title primary-title>
        <v-spacer />
        <div class="headline">Experiment validated for the scene "{{ sceneName }}"</div>
        <v-spacer />
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn flat exact to="/experiments/">
          <v-icon left>home</v-icon>
          Select another experiment
        </v-btn>

        <v-btn flat exact :to="`/experiments/${experimentName}`">
          <v-icon left>arrow_back</v-icon>
          Go back to scene selection
        </v-btn>
        <v-btn v-if="hasScenesLeft" flat exact :to="`/experiments/${experimentName}/${getRandomScene}`">
          <v-icon left>shuffle</v-icon>
          Continue with a random scene
        </v-btn>
        <div v-if="!hasScenesLeft" class="headline">You finished all the scenes, thanks for your contribution!</div>
        <v-spacer />
      </v-card-actions>
    </v-card> -->

    <loader v-if="!loaded" :message="loadingMessage" />

    <div v-if="loaded" style="margin-top:10%">
      <p style="font-size: 1.4em;">
        Nous vous remercions d'avoir participé à cette expérience.
        Elle va nous permettre d'améliorer les calculs d'images.
      </p>
    </div>

    <!-- Add of newsletter component -->
    <Newsletter v-if="loaded" />
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue'
import { mapActions, mapGetters } from 'vuex'
import Experiments from '@/router/experiments'
import { getExperimentSceneList } from '@/config.utils'
import { rand } from '@/functions'
import Newsletter from '@/components/ExperimentsComponents/Newsletter.vue'

export default {
  name: 'ExperimentValidated',
  components: {
    Newsletter,
    Loader
  },
  props: {
    experimentName: {
      type: String,
      required: true
    },
    sceneName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      experimentFullName: null,
      availableScenes: [],
      showCalibrationEvery: 5,
      loaded: false,
      loadingMessage: 'Chargement...'
    }
  },
  computed: {
    ...mapGetters(['getAllExperimentProgress']),
    ...mapActions(['loadScenesList']),

    hasScenesLeft() {
      return this.availableScenes.length > 0
    },
    getRandomScene() {
      return this.availableScenes[rand(0, this.availableScenes.length - 1)]
    }
  },
  async mounted() {
    // reload scene list to update
    await this.loadScenesList

    const scenesList = getExperimentSceneList(this.experimentName)

    // load current user progression
    this.progression = this.getAllExperimentProgress()

    // Find the selected experiment full name
    this.experimentFullName = Experiments.find(x => x.name === this.experimentName).meta.fullName

    // Get a list of available and not already validated scenes for this experiment
    this.availableScenes = Object.keys(this.progression[this.experimentName])
      .filter(aScene =>
        scenesList.includes(aScene) &&
        this.progression[this.experimentName] &&
        !this.progression[this.experimentName][aScene].done)

    // check if necessary to show calibration before new scenes
    if (window.sessionStorage.getItem('sin3d-nb-scenes') !== null) {
      let nScenes = Number(window.sessionStorage.getItem('sin3d-nb-scenes'))
      window.sessionStorage.setItem('sin3d-nb-scenes', nScenes + 1)

      if (nScenes % this.showCalibrationEvery === 0) {
        this.$router.push(`/experiments/${this.experimentName}/50_shades_of_grey`)
      }
      else if (this.hasScenesLeft) {
        this.$router.push(`/experiments/${this.experimentName}/${this.getRandomScene}`)
      }
    }

    this.loaded = true
  }
}
</script>
