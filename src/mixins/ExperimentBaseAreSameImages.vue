<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
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

      image1: null,
      image2: null
    }
  },
  computed: {
    ...mapGetters(['getHostURI'])
  },
  methods: {
    scrollToChoiceButtons() {
      const ele = document.querySelector('#choice')
      if (ele) ele.scrollIntoView({ behavior: 'smooth' })
    },

    // Get images links for a test
    async getTest(leftQuality, rightQuality) {
      const res = await Promise.all([this.getImage(leftQuality), this.getImage(rightQuality)])
      const [image1, image2] = res.map(x => {
        x.link = `${this.getHostURI}${x.link}`
        return x
      })
      return { image1, image2 }
    },

    // Get a test with random qualities
    getRandomTest() {
      return this.getTest(
        this.qualities[rand(0, this.qualities.length - 1)],
        this.qualities[rand(0, this.qualities.length - 1)]
      )
    },

    // Get a test with random qualities
    getReferenceTest() {
      // Randomly choose which is the reference image (0 = left, 1 = right)
      const isReferenceLeft = rand(0, 1) === 0
      // Randomly choose a quality for the other image
      const randomQuality = this.qualities[rand(0, this.qualities.length - 1)]

      const res = [this.qualities[this.qualities.length - 1], randomQuality]
      this.referenceImagePosition = isReferenceLeft ? 'left' : 'right'
      const table = isReferenceLeft ? res : res.reverse()
      return this.getTest(table[0], table[1])
    },

    /** An action was triggered, load a new test and save progression
     * @param {Boolean} areTheSame Are the images the same
     * @param {Function} getTestFn Function to be called to get the next tests
     * @param {Function} additionalData Object to concat to log
     * @returns {void}
     */
    async areTheSameAction(areTheSame, getTestFn, additionalData) {
      this.loadingMessage = 'Loading new test...'
      this.loadingErrorMessage = null
      try {
        this.testCount++

        const obj = Object.assign({
          image1: this.image1,
          image2: this.image2,
          areTheSame,
          experimentName: this.experimentName,
          sceneName: this.sceneName,
          referenceImagePosition: this.referenceImagePosition || undefined
        }, additionalData || {})
        this.sendMessage({ msgId: experimentMsgId.DATA, msg: obj })

        const { image1, image2 } = await getTestFn()
        this.image1 = image1
        this.image2 = image2

        // Experiment end
        if (this.testCount > this.maxTestCount) return this.finishExperiment()
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
      this.$router.push(`/experiments/${this.experimentName}/${this.sceneName}/validated`)
    }
  }
}
</script>
