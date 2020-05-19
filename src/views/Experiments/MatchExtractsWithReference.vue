<template>
  <ExperimentBlock
    :run-expe="runExpe"
    :experiment-name="experimentName"
    :scene-name="sceneName"
    :loading-message="loadingMessage"
    :loading-error-message="loadingErrorMessage"
  >
    <template v-slot:header>
      <!-- Extract configuration -->
      <extract-configuration
        v-if="lockConfig === false"
        @setExtractConfig="setExtractConfig($event, $refs.configurator)"
        :loading-error-message="loadingErrorMessage"
        ref="configurator"
      />
      <!--/ Extract configuration -->
    </template>

    <template v-slot:content>
      <v-flex v-if="explanation === true" xs12 sm12>
        <div style="margin-top:15%">
          <p>
            Vous allez voir des images, l'image de droite constitue toujours l'image de référence. Vous devez régler la qualité de l'image de gauche pour qu'elle soit la plus proche de l'image de droite.
            La première image est constitué de carré gris, c'est une partie de calibration. Si vous souhaitez régler votre écran (contraste, luminosité) vous pouvez le faire maintenant mais il vous est demandé de ne plus changer ce réglage au cours de l'expérience.
            Vous allez ensuite voir des scènes d'image de synthèse. Vous pouvez arrêter l'expérience quand vous souhaitez (ou faire une pause).
          </p>

          <v-btn @click="startExperiment" color="#007acc" large>Commencer l'expérience</v-btn>
        </div>
      </v-flex>

      <v-flex v-if="haveBreak === true" xs12 sm12>
        <div style="margin-top:15%">
          <p>
            Nous vous remercions d'avoir participé à cette expérience.
            Elle va nous permettre d'améliorer les calculs d'images. Si vous le souhaitez, vous pouvez revenir sur l'expérience via le <a :href="launcherURI" target="_blank">launcher</a> pour revoir de nouvelles images.
          </p>

          <v-btn @click="startExperiment" color="#007acc" large>Continuer l'expérience</v-btn>
        </div>
      </v-flex>

      <v-flex v-if="runExpe === true" xs12 sm6 :style="{ 'max-width': maxWidth + 'px', 'min-width': maxWidth + 'px', 'margin-right': 20 + 'px' }">
        <v-card dark color="primary" :max-width="maxWidth" :min-width="maxWidth">
          <!-- <v-card-text class="px-0">Experiment image</v-card-text> -->

          <v-container class="pa-1">
            <template v-for="i in extractConfig.y">
              <v-layout row wrap :key="`row-${i}`">
                <v-flex
                  v-for="(anExtract, index) in extracts.slice(extractConfig.x * (i - 1), (extractConfig.x * i))"
                  :key="`extract-${i}-${extractConfig.x}-${extractConfig.y}-${index}-${anExtract.quality}`"
                  class="pa-0"
                >
                  <v-card flat tile class="d-flex height100">
                    <div
                      v-if="anExtract.loading"
                      class="img-extract-loader"
                      @click.right.prevent
                    >
                      <v-progress-circular
                        :indeterminate="true"
                      />
                    </div>
                    <v-img
                      v-else
                      :src="anExtract.link"
                      @click.left.prevent="extractAction($event, anExtract)"
                      @click.right.prevent="extractAction($event, anExtract)"
                      class="cursor"
                      :class="{ 'extract-hover-border': showHoverBorder === true }"
                      @error="extractsRemovedFromServerFallback"
                    >
                      <template v-slot:placeholder>
                        <v-layout fill-height align-center justify-center ma-0>
                          <v-progress-circular indeterminate color="grey lighten-5" />
                        </v-layout>
                      </template>
                    </v-img>
                  </v-card>
                </v-flex>
              </v-layout>
            </template>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex v-if="runExpe === true" sm6 xs12 :style="{ 'max-width': maxWidth + 'px', 'min-width': maxWidth + 'px' }">
        <v-card dark color="primary" :max-width="maxWidth" :min-width="maxWidth">
          <!-- <v-card-text>Reference image</v-card-text> -->
          <v-img v-if="referenceImage" :src="referenceImage" :max-height="maxHeight" :max-width="maxWidth" :min-width="maxWidth" />
        </v-card>
      </v-flex>
      <!-- Experiment validation button -->
      <v-layout v-if="runExpe === true" justify-end align-content-end>
        <v-text-field
          v-model="comment"
          label="Ajouter un commentaire ici"
        />

        <v-btn @click="userBreak" color="primary" large right>Faire une pause</v-btn>

        <v-btn @click="finishExperiment" color="success" large right>Passser à l'image suivante</v-btn>
      </v-layout>
      <!--/ Experiment validation button -->
    </template>
  </ExperimentBlock>
</template>

<script>
import { mapGetters } from 'vuex'

import ExperimentBlock from '@/components/ExperimentBlock.vue'
import ExperimentBaseExtracts from '@/mixins/ExperimentBaseExtracts'
import ExtractConfiguration from '@/components/ExperimentsComponents/ExtractConfiguration.vue'

export default {
  components: {
    ExperimentBlock,
    ExtractConfiguration
  },
  mixins: [ExperimentBaseExtracts],

  data() {
    return {
      referenceImage: null,
      maxWidth: null,
      maxHeight: null,
      launcherURI: null,
      explanation: false,
      haveBreak: false,
      runExpe: false
    }
  },
  computed: {
    ...mapGetters(['getHostURI'])
  },
  async mounted() {
    // Load config for this scene to local state
    this.loadConfig()

    // Load progress from store into local state
    this.loadProgress()

    this.launcherURI = this.getHostURI + '/launcher/'

    let reference = null

    // Load scene data from the API
    await Promise.all([
      this.getImage('max').then(res => (reference = res)),
      this.getQualitiesList()
    ])

    this.referenceImage = reference.link

    this.maxWidth = reference.metadata.width
    this.maxHeight = reference.metadata.height

    // Load the cached configuration in the configurator component
    if (this.lockConfig === false) this.$refs.configurator.setDefaultConfig(this.extractConfig)

    // Load extracts if none were cached
    // if (this.extracts.length === 0)
    await this.setExtractConfig(this.extractConfig, this.$refs.configurator)

    this.saveProgress()
    this.loadExperimentState()
  },
  methods: {
    startExperiment() {
      this.explanation = false
      this.haveBreak = false
      this.runExpe = true
    },
    userBreak() {
      this.haveBreak = true
      this.explanation = false
      this.runExpe = false
    },
    loadExperimentState() {
      this.explanation = false
      this.haveBreak = false
      this.runExpe = false

      if (this.sceneName === '50_shades_of_grey') {
        this.explanation = true
      }
      else {
        this.runExpe = true
      }
    }
  }
}
</script>
