<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <!-- Link encoder -->
      <v-card>
        <v-container fluid fill-height>
          <v-layout column align-center>
            <v-card-title class="headline d-block text-md-center font-weight-bold">Link generator</v-card-title>

            <v-card-text>
              <v-form>
                <h2>*Host configuration</h2>
                <v-text-field
                  v-model="encoder.webAppUrl"
                  label="*Web application link"
                />
                <v-text-field
                  v-model="encoder.hostConfig"
                  label="*Server link"
                />

                <h2>User ID and experiment ID</h2>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-checkbox
                      v-model="encoder.userId.activated"
                      color="primary"
                      label="User ID"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs8>
                    <v-text-field
                      v-model="encoder.userId.value"
                      label="User ID"
                      type="text"
                      :disabled="!encoder.userId.activated"
                    />
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs4>
                    <v-checkbox
                      v-model="encoder.experimentId.activated"
                      color="primary"
                      label="Experiment ID"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs8>
                    <v-text-field
                      v-model="encoder.experimentId.value"
                      label="Experiment ID"
                      type="text"
                      :disabled="!encoder.experimentId.activated"
                    />
                  </v-flex>
                </v-layout>


                <h2>Experiment name and scene name</h2>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-checkbox
                      v-model="encoder.experimentName.activated"
                      color="primary"
                      label="Experiment name"
                      @click="encoder.sceneName.activated = false"
                    />
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      v-model="encoder.experimentName.value"
                      :items="encoder.experimentsSelectItems"
                      item-text="text"
                      item-value="value"
                      label="Experiment name"
                      :disabled="!encoder.experimentName.activated"
                    />
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs4>
                    <v-checkbox
                      v-model="encoder.sceneName.activated"
                      color="primary"
                      label="Scene name"
                      :disabled="!encoder.experimentName.activated || encoder.experimentName.value === ''"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs8>
                    <v-select
                      v-model="encoder.sceneName.value"
                      :items="encoder.scenesSelectItems"
                      item-text="text"
                      item-value="value"
                      label="Scene name"
                      :disabled="!encoder.sceneName.activated"
                    />
                  </v-flex>
                </v-layout>

                <v-btn color="primary" @click="generateLink">Generate link</v-btn>

                <div v-if="encoder.linkOutput && encoder.dataOutput">
                  <h2 class="mt-5">Result</h2>
                  <v-textarea
                    :value="encoder.linkOutput"
                    label="Your generated link"
                    type="text"
                    readonly
                  />

                  Data in the generated link:
                  <pre>{{ encoder.dataOutput }}</pre>
                </div>

                <v-slide-y-transition mode="out-in">
                  <v-alert v-if="encoder.alertMessage" :value="true" type="info" v-text="encoder.alertMessage" />
                </v-slide-y-transition>
              </v-form>
            </v-card-text>
          </v-layout>
        </v-container>
      </v-card>
      <!--/ Link encoder -->

      <!-- Link decoder -->
      <v-card class="mt-5">
        <v-container fluid fill-height>
          <v-layout column align-center>
            <v-card-title class="headline d-block text-md-center font-weight-bold">Link decoder</v-card-title>

            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="decoder.link"
                  label="Link to decode"
                />

                <div v-if="decoder.dataOutput">
                  Data in the provided link:
                  <pre>{{ decoder.dataOutput }}</pre>
                </div>

                <v-slide-y-transition mode="out-in">
                  <v-alert v-if="decoder.alertMessage" :value="true" type="info" v-text="decoder.alertMessage" />
                </v-slide-y-transition>
              </v-form>
            </v-card-text>
          </v-layout>
        </v-container>
      </v-card>
      <!--/ Link decoder -->
    </v-flex>
  </v-layout>
</template>

<script>
import Experiments from '@/router/experiments'
import { getExperimentSceneList } from '@/config.utils'

export default {
  name: 'LinkGenerator',
  components: {
  },
  data() {
    return {
      encoder: {
        webAppUrl: 'https://diran.univ-littoral.fr',
        hostConfig: 'https://diran.univ-littoral.fr',

        userId: {
          activated: false,
          value: ''
        },

        experimentId: {
          activated: false,
          value: ''
        },

        experimentName: {
          activated: false,
          value: ''
        },

        sceneName: {
          activated: false,
          value: ''
        },

        experimentsSelectItems: null,
        scenesSelectItems: null,

        linkOutput: null,
        dataOutput: null,
        alertMessage: null
      },

      decoder: {
        link: '',
        dataOutput: null,
        alertMessage: null
      }
    }
  },

  watch: {
    'encoder.experimentName.activated'(newValue) {
      // Reset available scenes if experiment changed
      if (!newValue) this.encoder.scenesSelectItems = null
    },
    'encoder.experimentName.value'(newValue) {
      // Reset available scenes if experiment changed
      if (newValue !== '') this.encoder.scenesSelectItems = getExperimentSceneList(this.encoder.experimentName.value)
    },
    'encoder.sceneName.activated'(newValue) {
      // Load available scenes when sceneName is activated
      if (newValue) this.encoder.scenesSelectItems = getExperimentSceneList(this.encoder.experimentName.value)
      else this.encoder.scenesSelectItems = null
    },

    'decoder.link'(newValue) {
      this.decoder.alertMessage = null
      if (newValue) this.decode(newValue)
      else this.decoder.dataOutput = null
    }
  },

  mounted() {
    this.encoder.experimentsSelectItems = Experiments.map(expe => ({
      text: `${expe.name} - ${expe.meta.fullName}`,
      value: expe.name
    }))
  },

  methods: {
    generateLink() {
      this.alertMessage = null

      // Check host configuration is set
      if (this.encoder.webAppUrl === '' || this.encoder.hostConfig === '') {
        this.encoder.alertMessage = 'The host configuration is required.'
        this.encoder.linkOutput = null
        this.encoder.dataOutput = null
        return
      }

      // Generate the link
      let obj = {
        hostConfig: this.encoder.hostConfig
      }
      if (this.encoder.userId.activated && this.encoder.userId.value !== '') obj.userId = this.encoder.userId.value
      if (this.encoder.experimentId.activated && this.encoder.experimentId.value !== '') obj.experimentId = this.encoder.experimentId.value
      if (this.encoder.experimentName.activated && this.encoder.experimentName.value !== '') obj.experimentName = this.encoder.experimentName.value
      if (this.encoder.sceneName.activated && this.encoder.sceneName.value !== '') obj.sceneName = this.encoder.sceneName.value

      const q = btoa(JSON.stringify(obj)).replace(/[=]/g, '')
      this.encoder.linkOutput = `${this.encoder.webAppUrl}/#/?q=${q}`
      this.encoder.dataOutput = JSON.stringify(obj, null, 2)
    },

    decode(link) {
      try {
        const matched = link.match(/\?q=(.*)/)
        if (!matched || matched.length !== 2) throw new Error('The provided link is invalid.')
        let q = matched[1]
        try {
          q = atob(q)
        }
        catch {
          throw new Error('"q" is not a base64-encoded string.')
        }
        try {
          q = JSON.parse(q)
        }
        catch {
          throw new Error(`"q" encoded data is not JSON valid. Decoded base64 data: ${q}`)
        }
        this.decoder.dataOutput = JSON.stringify(q, null, 2)
      }
      catch (err) {
        this.decoder.alertMessage = err.message
      }
    }
  }
}
</script>
