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
                <h4>Web application configuration</h4>
                <v-text-field
                  v-model="form.webAppUrl"
                  label="*Web application link"
                />

                <h4>Server configuration</h4>
                <v-flex xs3>
                  <v-select
                    v-model="form.server.ssl"
                    :items="[false, true]"
                    label="*SSL"
                  />
                </v-flex>

                <v-text-field
                  v-model="form.server.host"
                  label="*Host IP address or hostname"
                />

                <v-text-field
                  v-model="form.server.port"
                  label="*Port"
                  type="number"
                />


                <h2>User ID and experiment ID</h2>
                <v-layout row wrap>
                  <v-flex xs5>
                    <v-checkbox
                      v-model="form.userId.activated"
                      color="primary"
                      label="User ID"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs6>
                    <v-text-field
                      v-model="form.userId.value"
                      label="User ID"
                      type="text"
                      :disabled="!form.userId.activated"
                    />
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs5>
                    <v-checkbox
                      v-model="form.experimentId.activated"
                      color="primary"
                      label="Experiment ID"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs6>
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
                  <v-flex xs5>
                    <v-checkbox
                      v-model="form.experimentName.activated"
                      color="primary"
                      label="Experiment name"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs6>
                    <v-text-field
                      v-model="form.experimentName.value"
                      label="Experiment name"
                      type="text"
                      :disabled="!form.experimentName.activated"
                    />
                  </v-flex>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs5>
                    <v-checkbox
                      v-model="form.sceneName.activated"
                      color="primary"
                      label="Scene name"
                    />
                  </v-flex>
                  <v-spacer />
                  <v-flex xs6>
                    <v-text-field
                      v-model="form.sceneName.value"
                      label="Scene name"
                      type="text"
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
                    disabled
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
export default {
  name: 'LinkGenerator',
  components: {
  },
  data() {
    return {
      form: {
        webAppUrl: 'http://diran.univ-littoral.fr',
        server: {
          ssl: false,
          host: 'diran.univ-littoral.fr',
          port: '80'
        },

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

      linkOutput: null,
      dataOutput: null,
      alertMessage: null
    }
  },

  methods: {
    generateLink() {
      this.alertMessage = null

      // Check host configuration is set
      if (this.form.webAppUrl === '' || this.form.server.host === '' || this.form.server.port === '') {
        this.alertMessage = 'The host configuration is required.'
        this.linkOutput = null
        this.dataOutput = null
        return
      }

      // Generate the link
      const obj = {
        hostConfig: {
          ssl: this.form.server.ssl,
          host: this.form.server.host,
          port: this.form.server.port
        }
      }
      if (this.form.userId.activated && this.form.userId.value !== '')obj.userId = this.form.userId.value
      if (this.form.experimentId.activated && this.form.experimentId.value !== '')obj.experimentId = this.form.experimentId.value
      if (this.form.experimentName.activated && this.form.experimentName.value !== '')obj.experimentName = this.form.experimentName.value
      if (this.form.sceneName.activated && this.form.sceneName.value !== '')obj.sceneName = this.form.sceneName.value

      // eslint-disable-next-line no-div-regex
      const q = btoa(JSON.stringify(obj)).replace(/=/g, '')
      this.linkOutput = `${this.form.webAppUrl}/#/?q=${q}`
      this.dataOutput = JSON.stringify(obj, null, 2)
    }
  }
}
</script>
