<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm5>
      <v-btn @click="backToGDPR">
        <v-icon left>arrow_back</v-icon>
        Go back to GDPR notice
      </v-btn>

      <v-card>
        <v-container fluid fill-height>
          <v-layout column align-center>
            <v-card-title class="headline d-block text-md-center font-weight-bold">Host configuration</v-card-title>

            <v-card-text>
              <v-slide-y-transition mode="out-in">
                <loader v-if="loadingMessage" :message="loadingMessage" />
                <v-form v-else ref="form">
                  <v-text-field
                    v-model="hostConfig"
                    label="Host link"
                    :rules="[v => !!v || 'Host is required']"
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
      hostConfig: null,

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

  mounted() {
    // if (process.env.NODE_ENV === 'development')
    //   this.hostConfig = 'http://localhost:5000'
    this.reset()
  },

  methods: {
    ...mapActions(['setHostConfig', 'setUserExperimentId', 'resetApp']),
    backToGDPR() {
      this.resetApp({ gdprConsent: true })
      this.$router.push('/')
    },

    reset() {
      this.hostConfig = 'https://diran.univ-littoral.fr'
      this.id.user = null
      this.id.hasUserId = false
      this.id.experiment = null
      this.id.hasExperimentId = false
      this.configErrorMessage = null
    },

    async validate() {
      if (!this.$refs.form.validate()) return

      this.loadingMessage = 'Checking host configuration...'
      this.configErrorMessage = null
      try {
        await this.setHostConfig(this.hostConfig)
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
