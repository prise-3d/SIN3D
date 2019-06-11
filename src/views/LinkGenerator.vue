<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-card>
        <v-container fluid fill-height>
          <v-layout column align-center>
            <v-card-title class="headline d-block text-md-center font-weight-bold">Link generator</v-card-title>

            <v-card-text>
              <v-form>
                <h2>*Host configuration</h2>
                <v-text-field
                  v-model="form.webAppUrl"
                  label="*Web application link"
                />
                <v-text-field
                  v-model="form.hostConfig"
                  label="*Server link"
                />

                <h2>User ID and experiment ID</h2>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-checkbox
                      v-model="form.userId.activated"
                      color="primary"
                      label="User ID"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs8>
                    <v-text-field
                      v-model="form.userId.value"
                      label="User ID"
                      type="text"
                      :disabled="!form.userId.activated"
                    />
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs4>
                    <v-checkbox
                      v-model="form.experimentId.activated"
                      color="primary"
                      label="Experiment ID"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs8>
                    <v-text-field
                      v-model="form.experimentId.value"
                      label="Experiment ID"
                      type="text"
                      :disabled="!form.experimentId.activated"
                    />
                  </v-flex>
                </v-layout>


                <h2>Experiment name and scene name</h2>
                <v-layout row wrap>
                  <v-flex xs4>
                    <v-checkbox
                      v-model="form.experimentName.activated"
                      color="primary"
                      label="Experiment name"
                      @click="form.sceneName.activated = false"
                    />
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      v-model="form.experimentName.value"
                      :items="experimentsSelectItems"
                      item-text="text"
                      item-value="value"
                      label="Experiment name"
                      :disabled="!form.experimentName.activated"
                    />
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs4>
                    <v-checkbox
                      v-model="form.sceneName.activated"
                      color="primary"
                      label="Scene name"
                      :disabled="!form.experimentName.activated || form.experimentName.value === ''"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs8>
                    <v-select
                      v-model="form.sceneName.value"
                      :items="scenesSelectItems"
                      item-text="text"
                      item-value="value"
                      label="Scene name"
                      :disabled="!form.sceneName.activated"
                    />
                  </v-flex>
                </v-layout>

                <v-btn color="primary" @click="generateLink">Generate link</v-btn>

                <div v-if="linkOutput && dataOutput">
                  <h2 class="mt-5">Result</h2>
                  <v-textarea
                    :value="linkOutput"
                    label="Your generated link"
                    type="text"
                    readonly
                  />

                  Data in the generated link:
                  <pre>{{ dataOutput }}</pre>
                </div>

                <v-slide-y-transition mode="out-in">
                  <v-alert v-if="alertMessage" :value="true" type="info" v-text="alertMessage" />
                </v-slide-y-transition>
              </v-form>
            </v-card-text>
          </v-layout>
        </v-container>
      </v-card>
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
      form: {
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
        }
      },

      experimentsSelectItems: null,
      scenesSelectItems: null,

      linkOutput: null,
      dataOutput: null,
      alertMessage: null
    }
  },

  watch: {
    'form.experimentName.activated'(newValue) {
      // Reset available scenes if experiment changed
      if (!newValue) this.scenesSelectItems = null
    },
    'form.experimentName.value'(newValue) {
      // Reset available scenes if experiment changed
      if (newValue !== '') this.scenesSelectItems = getExperimentSceneList(this.form.experimentName.value)
    },
    'form.sceneName.activated'(newValue) {
      // Load available scenes when sceneName is activated
      if (newValue) this.scenesSelectItems = getExperimentSceneList(this.form.experimentName.value)
      else this.scenesSelectItems = null
    }
  },

  mounted() {
    this.experimentsSelectItems = Experiments.map(expe => ({
      text: `${expe.name} - ${expe.meta.fullName}`,
      value: expe.name
    }))
  },

  methods: {
    generateLink() {
      this.alertMessage = null

      // Check host configuration is set
      if (this.form.webAppUrl === '' || this.form.hostConfig === '') {
        this.alertMessage = 'The host configuration is required.'
        this.linkOutput = null
        this.dataOutput = null
        return
      }

      // Generate the link
      const obj = {
        hostConfig: this.form.hostConfig
      }
      if (this.form.userId.activated && this.form.userId.value !== '') obj.userId = this.form.userId.value
      if (this.form.experimentId.activated && this.form.experimentId.value !== '') obj.experimentId = this.form.experimentId.value
      if (this.form.experimentName.activated && this.form.experimentName.value !== '') obj.experimentName = this.form.experimentName.value
      if (this.form.sceneName.activated && this.form.sceneName.value !== '') obj.sceneName = this.form.sceneName.value

      // eslint-disable-next-line no-div-regex
      const q = btoa(JSON.stringify(obj)).replace(/=/g, '')
      this.linkOutput = `${this.form.webAppUrl}/#/?q=${q}`
      this.dataOutput = JSON.stringify(obj, null, 2)
    }
  }
}
</script>
