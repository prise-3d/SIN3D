<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import './style.css'
import ExperimentBase from '@/mixins/ExperimentBase'

import { mapGetters } from 'vuex'
import { rand } from '@/functions'
import { EXPERIMENT as experimentMsgId } from '@/../config.messagesId'

export default {
  name: 'ExperimentBaseAreSameImages',
  mixins: [ExperimentBase],
  data() {
    return {
      maxTestCount: null,
      testCount: 1,

      leftImage: { link: null, quality: null },
      rightImage: { link: null, quality: null }
    }
  },
  computed: {
    ...mapGetters(['getHostURI'])
  },
  methods: {
    async getTest(leftQuality, rightQuality) {
      const left = this.qualities[leftQuality]
      const right = this.qualities[rightQuality]
      const res = await Promise.all([this.getImage(left), this.getImage(right)])
      const [leftImage, rightImage] = res.map(x => {
        x.link = `${this.getHostURI}${x.link}`
        return x
      })
      return { leftImage, rightImage }
    },

    getRandomTest() {
      return this.getTest(rand(0, this.qualities.length - 1), rand(0, this.qualities.length - 1))
    },

    // An action was triggered, load extracts and save progression
    async areTheSameActionRandom(areTheSame) {
      this.loadingMessage = 'Loading new test...'
      this.loadingErrorMessage = null
      try {
        this.testCount++

        const obj = {
          leftImage: this.leftImage,
          rightImage: this.rightImage,
          areTheSame,
          experimentName: this.experimentName,
          sceneName: this.sceneName
        }
        this.sendMessage({ msgId: experimentMsgId.DATA, msg: obj })

        const { leftImage, rightImage } = await this.getRandomTest()
        this.leftImage = leftImage
        this.rightImage = rightImage

        // Experiment end
        if (this.testCount >= this.maxTestCount) this.finishExperiment()
      }
      catch (err) {
        console.error('Failed to load new test', err)
        this.loadingErrorMessage = 'Failed to load new test. ' + err.message
      }
      finally {
        this.loadingMessage = null
        this.saveProgress()
      }
    },

    // Finish an experiment, sending full data to the server
    // Don't forget to surcharge this function when using this mixin to add more data
    finishExperiment() {
      const obj = {
        experimentName: this.experimentName,
        sceneName: this.sceneName
      }
      this.sendMessage({ msgId: experimentMsgId.VALIDATED, msg: obj })
      this.setExperimentDone({ experimentName: this.experimentName, sceneName: this.sceneName, done: true })
      this.$router.push(`/experiments/${this.experimentName}`)
    }
  }
}
</script>
