<template>
  <div>
    <h2>"{{ experimentFullName }}"</h2>

    <v-card>
      <v-card-title primary-title>
        <v-spacer />
        <div class="headline">Experiment validated for the scene "{{ sceneName }}"</div>
        <v-spacer />
      </v-card-title>
      <v-card-actions>
        <v-spacer />
        <!-- <v-btn flat exact to="/experiments/">
          <v-icon left>home</v-icon>
          Select another experiment
        </v-btn>

        <v-btn flat exact :to="`/experiments/${experimentName}`">
          <v-icon left>arrow_back</v-icon>
          Go back to scene selection
        </v-btn> -->
        <v-btn v-if="hasScenesLeft" flat exact :to="`/experiments/${experimentName}/${getRandomScene}`">
          <v-icon left>shuffle</v-icon>
          Continue with a random scene
        </v-btn>
        <div v-if="!hasScenesLeft" class="headline">You finished all the scene, thanks for your contribution</div>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Experiments from '@/router/experiments'
import { getExperimentSceneList } from '@/config.utils'
import { rand } from '@/functions'

export default {
  name: 'ExperimentValidated',
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
      availableScenes: []
    }
  },
  computed: {
    ...mapState(['progression']),

    hasScenesLeft() {
      return this.availableScenes.length > 0
    },
    getRandomScene() {
      return this.availableScenes[rand(0, this.availableScenes.length - 1)]
    }
  },
  mounted() {
    const scenesList = getExperimentSceneList(this.experimentName)

    // Find the selected experiment full name
    this.experimentFullName = Experiments.find(x => x.name === this.experimentName).meta.fullName

    // Get a list of available and not already validated scenes for this experiment
    this.availableScenes = Object.keys(this.progression[this.experimentName])
      .filter(aScene =>
        scenesList.includes(aScene) &&
        this.progression[this.experimentName] &&
        !this.progression[this.experimentName][aScene].done)

    this.$router.push(`/experiments/${this.experimentName}/${this.getRandomScene}`)
  }
}
</script>
