<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import ExperimentBase from '@/mixins/ExperimentBase'

import { mapGetters } from 'vuex'
import { API_ROUTES, findNearestUpper, findNearestLower } from '@/functions'
import { EXPERIMENT as experimentMsgId } from '@/../config.messagesId'

export default {
  name: 'ExperimentBaseExtracts',
  mixins: [ExperimentBase],
  data() {
    return {
      // Updated when `setExtractConfig` is called
      extractConfig: {
        x: null,
        y: null
      },
      extracts: [],
      extractsInfos: null,

      showHoverBorder: null,
      lockConfig: null,
      comment: null
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
      data.extracts = data.extracts.map(x => this.getHostURI + x)
      return data
    },

    // Convert a simple API extracts object to get more informations
    getExtractFullObject(extractsApiObj) {
      return extractsApiObj.extracts.map((url, i) => ({
        link: url,
        quality: extractsApiObj.info.image.quality,
        zone: i + 1,
        index: i,
        nextQuality: findNearestUpper(extractsApiObj.info.image.quality, this.qualities),
        precQuality: findNearestLower(extractsApiObj.info.image.quality, this.qualities),
        loading: false
      }))
    },

    // Config was updated, load extracts and save progression
    async setExtractConfig(config, configuratorRef) {
      if (!config) return

      this.loadingMessage = 'Loading configuration extracts...'
      this.loadingErrorMessage = null
      try {
        this.extractConfig.x = config.x
        this.extractConfig.y = config.y
        this.extractConfig.quality = config.quality
        const data = await this.getExtracts(config.quality || undefined)
        this.extractsInfos = data.info
        this.extracts = this.getExtractFullObject(data)

        // If there is a configurator, retract it
        if (configuratorRef) configuratorRef.setVisibility(false)
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
      const { index, nextQuality, precQuality, quality } = extractObj

      let action, newQuality
      if (event.button === 0) action = 'needLess' // Left click
      if (event.button === 2) action = 'needMore' // Right click

      if (action === 'needLess') newQuality = precQuality
      if (action === 'needMore') newQuality = nextQuality

      // Do not load a new extract if same quality
      if (newQuality === quality) return

      // Set loading state
      this.extracts[index].loading = true
      try {
        const collectedData = this.getClickDataObject(event, extractObj, action)
        this.sendMessage({ msgId: experimentMsgId.DATA, msg: collectedData })

        // Loading new extract
        const data = await this.getExtracts(newQuality)
        this.extracts[index].link = data.extracts[index]
        this.extracts[index].quality = data.info.image.quality
        this.extracts[index].nextQuality = findNearestUpper(data.info.image.quality, this.qualities)
        this.extracts[index].precQuality = findNearestLower(data.info.image.quality, this.qualities)
        this.extracts[index].loading = false
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

    getClickDataObject(event, extractObj, action) {
      const { index } = extractObj

      const clientSideData = {
        extractSize: {
          width: event.target.clientWidth,
          height: event.target.clientHeight
        },
        imageSize: {
          width: event.target.clientWidth * this.extractConfig.x,
          height: event.target.clientHeight * this.extractConfig.y
        },
        clickPosition: {
          extract: {
            x: event.offsetX,
            y: event.offsetY
          },
          image: {
            x: event.offsetX + (this.extracts[index].index % this.extractConfig.x) * event.target.clientWidth,
            y: event.offsetY + (Math.floor(this.extracts[index].index / this.extractConfig.x)) * event.target.clientHeight
          }
        }
      }

      const calculatedRealData = {}
      calculatedRealData.extractSize = {
        width: this.extractsInfos.extractsSize.width,
        height: this.extractsInfos.extractsSize.height
      }
      calculatedRealData.imageSize = {
        width: this.extractsInfos.image.metadata.width,
        height: this.extractsInfos.image.metadata.height
      }
      calculatedRealData.clickPosition = {
        extract: {
          x: Math.floor((calculatedRealData.imageSize.width * clientSideData.clickPosition.extract.x) / clientSideData.imageSize.width),
          y: Math.floor((calculatedRealData.imageSize.height * clientSideData.clickPosition.extract.y) / clientSideData.imageSize.height)
        },
        image: {
          x: Math.floor((calculatedRealData.imageSize.width * clientSideData.clickPosition.image.x) / clientSideData.imageSize.width),
          y: Math.floor((calculatedRealData.imageSize.height * clientSideData.clickPosition.image.y) / clientSideData.imageSize.height)
        }
      }

      // Sending event to WebSocket server
      const loggedObj = {
        experimentName: this.experimentName,
        sceneName: this.sceneName,
        extractConfig: this.extractConfig,
        clickedExtract: {
          link: this.extracts[index].link,
          quality: this.extracts[index].quality,
          nextQuality: this.extracts[index].nextQuality,
          precQuality: this.extracts[index].precQuality,
          zone: this.extracts[index].zone,
          index: this.extracts[index].index
        },
        action,
        clientSideData,
        calculatedRealData
      }

      return loggedObj
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
        referenceImage: this.referenceImage,
        comment: this.comment
      }
      this.sendMessage({ msgId: experimentMsgId.VALIDATED, msg: obj })
      this.setExperimentFinished()
      this.$router.push(`/experiments/${this.experimentName}/${this.sceneName}/validated`)
    }
  }
}
</script>

<style>
/* White border when hovering on extracts */
 .extract-hover-border:hover {
  z-index: 1;
  outline: 2px #f4f4f4 solid;
}

.img-extract-loader {
  height: 100%;
  width: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
