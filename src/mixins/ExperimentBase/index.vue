<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { API_ROUTES } from '@/functions'

export default {
  name: 'ExperimentBase',
  props: {
    sceneName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      experimentName: null, // Must be redefined in parent component

      loadingMessage: null,
      loadingErrorMessage: null,
      qualities: null
    }
  },
  computed: {
    ...mapGetters(['getHostURI', 'getExperimentProgress'])
  },
  methods: {
    ...mapActions(['setExperimentProgress', 'setExperimentDone', 'sendMessage']),

    // Load progress from store into local state
    loadProgress() {
      if (!this.experimentName || !this.sceneName)
        return console.warn('Could not load progress : experimentName and sceneName must be defined')

      const progress = this.getExperimentProgress({ experimentName: this.experimentName, sceneName: this.sceneName })
      Object.assign(this.$data, progress)
      // console.log('Loaded data from store to local state.', progress)
    },

    // Save progress from local state into store
    saveProgress() {
      if (!this.experimentName || !this.sceneName)
        return console.warn('Could not save progress : experimentName and sceneName must be defined')
      this.setExperimentProgress({ experimentName: this.experimentName, sceneName: this.sceneName, data: this.$data })
      // console.log('Saved data from local state to store.', this.$data)
    },

    async finishExperiment() {
      this.setExperimentDone({ experimentName: this.experimentName, sceneName: this.sceneName, done: true })
      this.$router.push(`/experiments/${this.experimentName}`)
    },


    // Load qualities list from the API
    async getQualitiesList() {
      if (this.qualities) return

      const URI = `${this.getHostURI}${API_ROUTES.listSceneQualities(this.sceneName)}`
      const { data } = await fetch(URI).then(res => res.json())
      this.qualities = data
      this.saveProgress()
    }
  }
}
</script>
