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
      <v-flex v-if="explanation === true || disableStart === true" xs12 sm12>
        <div style="margin-top:10%">
          <p v-if="disableStart === false && calibrationScene === true" style="font-size: 1.4em;">
            Vous allez voir des images, l'image de droite constitue toujours l'image de référence. Vous devez régler la qualité de l'image de gauche pour qu'elle soit la plus proche de l'image de droite.
            La première image est constituée de carré gris, c'est une partie de calibration. Si vous souhaitez régler votre écran (contraste, luminosité) vous pouvez le faire maintenant mais il vous est demandé de ne plus changer ce réglage au cours de l'expérience.
            Vous allez ensuite voir des scènes d'image de synthèse. Vous pouvez arrêter l'expérience quand vous souhaitez (ou faire une pause).
          </p>

          <p v-if="disableStart === true" style="margin-top:2%; color:orange; font-size: 1.4em;">
            <strong>Attention !</strong> L'expérience requiert un écran de résolution minimale de <strong>1920 x 1080</strong> pixels.
            <br />
            <br />
            Vous pouvez redimensionner la fenêtre de votre navigateur pour poursuivre l'expérience.
          </p>

          <p v-if="disableStart === false" style="margin-top:2%; color:#007acc; font-size: 1.4em;">
            <strong>La résolution de votre fenêtre de navigateur vous permet d'accéder à l'expérience</strong>.
          </p>

          <v-btn v-if="disableStart === true" @click="startExperiment" color="#007acc" large disabled>Poursuivre l'expérience</v-btn>
          <v-btn v-if="disableStart === false" @click="startExperiment" color="#007acc" large>Poursuivre l'expérience</v-btn>
        </div>
      </v-flex>

      <v-flex v-if="haveHelp === true" xs12 sm12>
        <div style="margin-top:10%">
          <p style="font-size: 1.4em;">
            Cette expérience vous propose le visuel deux images, celle de gauche considérée comme dégradée et celle de gauche, sa référence (image sans dégradation visible).

            <br />
            Vous devez régler la qualité de l'image de gauche pour qu'elle soit la plus proche de l'image de droite.
          </p>

          <br />
          <br />

          <p style="font-size: 1.4em;text-align:left">
            Pour cela deux actions vous sont proposées :
            <br />
            <ul>
              <li> <strong>clic droit de la souris :</strong> permet d'améliorer la qualité de l'image à l'endroit où de la dégradation vous est encore visible.</li>
              <li> <strong>clic gauche de la souris :</strong> permet de revenir à une qualité inférieure de l'image si l'amélioration apportée n'était pas nécessaire (aucune amélioration visible apportée après clic droit).</li>
            </ul>
          </p>

          <v-btn @click="startExperiment" color="#007acc" large>Continuer l'expérience</v-btn>
        </div>
      </v-flex>

      <v-flex v-if="haveBreak === true" xs12 sm12>
        <div style="margin-top:10%">
          <p style="font-size: 1.4em;">
            Nous vous remercions d'avoir participé à cette expérience.
            Elle va nous permettre d'améliorer les calculs d'images. Si vous le souhaitez, vous pouvez revenir sur l'expérience via le <a :href="launcherURI" target="_blank">launcher</a> pour revoir de nouvelles images.
          </p>

          <v-btn @click="startExperiment" color="#007acc" large>Continuer l'expérience</v-btn>
        </div>

        <!-- Add of newsletter component -->
        <Newsletter />
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


        <v-btn @click="userHelp" color="#737373" large right>Besoin d'aide ?</v-btn>

        <v-btn @click="userBreak" color="#cc7a00" large right>Arrêter ou faire une pause</v-btn>

        <v-btn @click="finishExperiment" color="success" large right>Valider & passer à l'image suivante</v-btn>
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
import Newsletter from '@/components/ExperimentsComponents/Newsletter.vue'

export default {
  components: {
    ExperimentBlock,
    ExtractConfiguration,
    Newsletter
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
      haveHelp: false,
      calibrationScene: false,
      runExpe: false,
      disableStart: false
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

    // check window size
    this.checkWindow()
    window.addEventListener('resize', this.checkWindow)
  },
  methods: {
    startExperiment() {
      this.runExpe = true
      this.explanation = false
      this.haveBreak = false
      this.haveHelp = false
    },
    userBreak() {
      this.haveBreak = true
      this.explanation = false
      this.runExpe = false
      this.haveHelp = false
    },
    userHelp() {
      this.haveHelp = true
      this.haveBreak = false
      this.explanation = false
      this.runExpe = false
    },
    loadExperimentState() {
      this.haveHelp = false
      this.explanation = false
      this.haveBreak = false
      this.runExpe = false

      if (this.sceneName === '50_shades_of_grey') {
        this.explanation = true
        this.calibrationScene = true
      }
      else {
        this.runExpe = true
      }
    },
    checkWindow() {
      // check window screen size
      if (window.innerWidth < 1920 || window.innerHeight < 900) {
        this.disableStart = true
        this.explanation = true
        this.runExpe = false
        this.haveBreak = false
        this.haveHelp = false
      }
      else {
        this.disableStart = false
      }
    }
  }
}
</script>
