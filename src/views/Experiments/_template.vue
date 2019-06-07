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
    </template>
  </ExperimentBlock>
</template>

<script>
import ExperimentBlock from '@/components/ExperimentBlock.vue'
import ExperimentBase from '@/mixins/ExperimentBase'

export default {
  components: {
    ExperimentBlock
  },
  mixins: [ExperimentBase],
  data() {
    return {}
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
  methods: {}
}
</script>


<style scoped>
/* Experiment-specific style (CSS) */
</style>
