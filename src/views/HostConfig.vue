<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm5>
      <v-card>
        <v-container fluid fill-height>
          <v-layout column align-center>
            <v-card-title class="headline d-block text-md-center font-weight-bold">Host configuration</v-card-title>

            <v-card-text>
              <v-slide-y-transition mode="out-in">
                <loader v-if="loadingMessage" :message="loadingMessage" />
                <v-form v-else ref="form">
                  <v-flex xs3>
                    <v-select
                      v-model="config.ssl"
                      :items="[false, true]"
                      label="SSL"
                    />
                  </v-flex>

                  <v-text-field
                    v-model="config.host"
                    label="Host IP address or hostname"
                    :rules="[v => !!v || 'Host is required']"
                    required
                  />

                  <v-text-field
                    v-model="config.port"
                    label="Port"
                    type="number"
                    :rules="[v => !!v || 'Port is required']"
                    required
                  />

                  <v-layout row wrap>
                    <v-flex xs5>
                      <v-checkbox
                        v-model="id.hasUserId"
                        color="primary"
                        :label="`I have an user ID`"
                      />
                    </v-flex>
                    <v-spacer />
                    <v-flex xs6>
                      <v-text-field
                        v-model="id.user"
                        label="User ID"
                        type="text"
                        :disabled="!id.hasUserId"
                      />
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs5>
                      <v-checkbox
                        v-model="id.hasExperimentId"
                        color="primary"
                        :label="`I have an experiment ID`"
                      />
                    </v-flex>
                    <v-spacer />
                    <v-flex xs6>
                      <v-text-field
                        v-model="id.experiment"
                        label="Experiment ID"
                        type="text"
                        :disabled="!id.hasExperimentId"
                      />
                    </v-flex>
                  </v-layout>

                  <v-btn color="error" @click="reset">Reset Form</v-btn>
                  <v-btn color="success" @click="validate">Submit</v-btn>

                  <v-slide-y-transition mode="out-in">
                    <v-alert v-if="configErrorMessage" :value="true" type="error" v-text="configErrorMessage" />
                  </v-slide-y-transition>
                </v-form>
              </v-slide-y-transition>
            </v-card-text>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Loader from '@/components/Loader.vue'
import { mapActions } from 'vuex'

export default {
  name: 'HostConfig',
  components: {
    Loader
  },
  data() {
    return {
      config: {
        ssl: false,
        host: 'diran.univ-littoral.fr',
        port: '80'
      },

      id: {
        user: null,
        hasUserId: false,
        experiment: null,
        hasExperimentId: false
      },

      loadingMessage: null,
      configErrorMessage: null
    }
  },

  watch: {
    'config.ssl'(newValue) {
      if (newValue === true) this.config.port = 443
    }
  },

  mounted() {
    // if (process.env.NODE_ENV === 'development')
    //   this.config = {
    //     ssl: false,
    //     host: 'localhost',
    //     port: '5000'
    //   }
  },

  methods: {
    ...mapActions(['setHostConfig', 'setUserExperimentId']),
    reset() {
      this.config.ssl = true
      this.config.host = ''
      this.config.port = null
      this.id.user = null
      this.id.hasUserId = false
      this.id.experiment = null
      this.id.hasExperimentId = false
      this.configErrorMessage = null
      this.$refs.form.reset()
    },
    async validate() {
      if (!this.$refs.form.validate()) return

      this.loadingMessage = 'Checking host configuration...'
      this.configErrorMessage = null
      try {
        await this.setHostConfig(this.config)
        this.setUserExperimentId({ userId: this.id.user, experimentId: this.id.experiment })
      }
      catch (err) {
        console.error(err)
        this.configErrorMessage = err.message
        return
      }
      finally {
        this.loadingMessage = null
      }

      // Success while configuring the project's host
    }
  }
}
</script>
