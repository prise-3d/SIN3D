<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import './style.css'
import ExperimentBase from '@/mixins/ExperimentBase'

import { mapGetters } from 'vuex'
import { API_ROUTES, findNearestUpper, findNearestLower } from '@/functions'
import { EXPERIMENT as experimentMsgId } from '@/../config.messagesId'

export default {
  name: 'ExperimentBaseExtracts',
  mixins: [ExperimentBase],
  data() {
    return {
      // Updated when `setConfig` is called
      extractConfig: {
        x: 4,
        y: 4
      },
      extracts: []
    }
  },
  computed: {
    ...mapGetters(['getHostURI'])
  },
  methods: {
    // Load extracts from the API
    async getExtracts(quality = 'min') {
      const URI = `${this.getHostURI}${API_ROUTES.getImageExtracts(this.sceneName, quality, this.extractConfig.x, this.extractConfig.y)}`
      const { data } = await fetch(URI)
        .then(async res => {
          res.json = await res.json()
          return res
        })
        .then(res => {
          if (!res.ok) throw new Error(res.json.message + res.json.data ? `\n${res.json.data}` : '')
          return res.json
        })
      return data
    },

    // Config was updated, load extracts and save progression
    async setConfig(config, configuratorRef) {
      if (!config || !configuratorRef) return

      this.loadingMessage = 'Loading configuration extracts...'
      this.loadingErrorMessage = null
      try {
        this.extractConfig.x = config.x
        this.extractConfig.y = config.y
        const data = await this.getExtracts()
        const hostURI = this.getHostURI
        this.extracts = data.extracts.map((url, i) => ({
          link: hostURI + url,
          quality: data.info.image.quality,
          zone: i + 1,
          index: i,
          nextQuality: findNearestUpper(data.info.image.quality, this.qualities),
          precQuality: findNearestLower(data.info.image.quality, this.qualities),
          loading: false
        }))
        configuratorRef.setVisibility(false)
      }
      catch (err) {
        console.error('Failed to load new configuration', err)
        this.loadingErrorMessage = 'Failed to load new configuration. ' + err.message
      }
      finally {
        this.loadingMessage = null
        this.saveProgress()
      }
    },

    // An action was triggered, load extracts and save progression
    async extractAction(event, extractObj) {
      console.log(event, extractObj)
      const { index, nextQuality, precQuality, quality } = extractObj

      let newQuality
      if (event.button === 0) newQuality = precQuality // Left click
      if (event.button === 2) newQuality = nextQuality // Right click

      // Do not load a new extract if same quality
      if (newQuality === quality) return

      // Set loading state
      this.extracts[index].loading = true
      try {
        // Loading new extract
        const data = await this.getExtracts(newQuality)
        this.extracts[index].link = this.getHostURI + data.extracts[index]
        this.extracts[index].quality = data.info.image.quality
        this.extracts[index].nextQuality = findNearestUpper(data.info.image.quality, this.qualities)
        this.extracts[index].precQuality = findNearestLower(data.info.image.quality, this.qualities)
        this.extracts[index].loading = false

        // Sending event to WebSocket server
      // this.sendMessage({ msgId: experimentMsgId.DATA, msg: obj })
      }
      catch (err) {
        // TODO: toast message if fail
        console.error('Failed to load extract', err)
      }
      finally {
        this.extracts[index].loading = false
        this.saveProgress()
      }
    },

    // Finish an experiment, sending full data to the server
    // Don't forget to surcharge this function when using this mixin to add more data
    finishExperiment() {
      const obj = {
        experimentName: this.experimentName,
        sceneName: this.sceneName,
        extractConfig: this.extractConfig,
        extracts: this.extracts.map(x => ({
          index: x.index,
          link: x.link,
          nextQuality: x.nextQuality,
          precQuality: x.precQuality,
          quality: x.quality,
          zone: x.zone
        })),
        qualities: this.qualities,
        referenceImage: this.referenceImage
      }
      this.sendMessage({ msgId: experimentMsgId.VALIDATED, msg: obj })
      this.setExperimentDone({ experimentName: this.experimentName, sceneName: this.sceneName, done: true })
      this.$router.push(`/experiments/${this.experimentName}`)
    }
  }
}
</script>
