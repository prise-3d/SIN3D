<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm5>
      <v-card>
        <v-content>
          <v-container fluid fill-height>
            <v-layout style="flex-direction: column; text-align: center">
              <h1>Host configuration</h1>

              <v-slide-y-transition mode="out-in">
                <loader v-if="loadingMessage" :message="loadingMessage" />
                <v-form v-else ref="form">
                  <v-flex xs3>
                    <v-select
                      v-model="config.protocol"
                      :items="['HTTP', 'HTTPS']"
                      label="Protocol"
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


                  <v-btn color="error" @click="reset">Reset Form</v-btn>

                  <v-btn color="success" @click="validate">Submit</v-btn>

                  <v-slide-y-transition mode="out-in">
                    <v-alert v-if="configErrorMessage" :value="true" type="error" v-text="configErrorMessage" />
                  </v-slide-y-transition>
                </v-form>
              </v-slide-y-transition>
            </v-layout>
          </v-container>
        </v-content>
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
        protocol: 'HTTP',
        host: 'diran.univ-littoral.fr',
        port: '80'
      },

      loadingMessage: null,
      configErrorMessage: null
    }
  },

  watch: {
    'config.protocol'(newValue) {
      if (newValue === 'HTTPS') this.config.port = 443
    }
  },

  methods: {
    ...mapActions(['setHostConfig']),
    reset() {
      this.config.protocol = 'HTTP'
      this.config.host = ''
      this.config.port = null
      this.configErrorMessage = null
      this.$refs.form.reset()
    },
    async validate() {
      if (!this.$refs.form.validate()) return

      this.loadingMessage = 'Checking host configuration...'
      this.configErrorMessage = null
      try {
        await this.setHostConfig(this.config)
      }
      catch (err) {
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
