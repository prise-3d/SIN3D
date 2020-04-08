<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { API_ROUTES } from '@/functions'
import { getExperimentConfig } from '@/config.utils'
import { EXPERIMENT as experimentMsgId } from '@/../config.messagesId'

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
      experimentName: this.$route.name,

      loadingMessage: null,
      loadingErrorMessage: null,
      qualities: null
    }
  },
  computed: {
    ...mapGetters(['getHostURI', 'getExperimentProgress', 'isExperimentDone'])
  },
  mounted() {
    if (!this.getExperimentProgress({ experimentName: this.experimentName, sceneName: this.sceneName }).experimentName)
      this.sendMessage({
        msgId: experimentMsgId.STARTED,
        msg: {
          experimentName: this.experimentName,
          sceneName: this.sceneName
        }
      })

    // Check if the experiment is already finished
    if (this.experimentName && this.sceneName && this.isExperimentDone({ experimentName: this.experimentName, sceneName: this.sceneName })) {
      console.warn('Redirected from experiment. You can\'t go back in an experiment after finishing it.')
      this.$router.push(`/experiments/${this.experimentName}`)
    }
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

    // Load a config object into the local state
    loadConfig() {
      const config = getExperimentConfig(this.experimentName, this.sceneName)
      // console.log('Loaded configuration', config)
      Object.assign(this.$data, config)
    },

    setExperimentFinished(done = true) {
      this.setExperimentDone({ experimentName: this.experimentName, sceneName: this.sceneName, done })
    },

    // Finish an experiment, sending full data to the server
    // Don't forget to surcharge this function when using this mixin to add more data
    finishExperiment() {
      const obj = Object.assign(this.$data, { sceneName: this.sceneName })
      obj.loadingMessage = undefined
      obj.loadingErrorMessage = undefined
      this.sendMessage({ msgId: experimentMsgId.VALIDATED, msg: obj })
      this.setExperimentFinished()
      this.$router.push(`/experiments/${this.experimentName}/${this.sceneName}/validated`)
    },


    // Load qualities list from the API
    async getQualitiesList() {
      if (this.qualities) return

      const URI = `${this.getHostURI}${API_ROUTES.listSceneQualities(this.sceneName)}`
      const { data } = await fetch(URI).then(res => res.json())
      this.qualities = data
    },


    // Load an image from the API
    async getImage(quality) {
      const URI = `${this.getHostURI}${API_ROUTES.getImage(this.sceneName, quality)}`
      const { data } = await fetch(URI)
        .then(async res => {
          res.json = await res.json()
          return res
        })
        .then(res => {
          if (!res.ok) throw new Error(res.json.message + res.json.data ? `\n${res.json.data}` : '')
          return res.json
        })
      data.link = this.getHostURI + data.link
      return data
    }
  }
}
</script>
