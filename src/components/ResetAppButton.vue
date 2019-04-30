<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      width="600"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <template v-slot:activator="{ on }">
        <v-btn small dark v-on="on">Reset app</v-btn>
      </template>

      <v-card>
        <v-card-title class="headline" primary-title>Reset app</v-card-title>

        <v-card-text>
          Resetting the app will purge the configuration, any cached data, progression or any other data stored client-side.<br><br>
          This action is not reversible.
        </v-card-text>

        <v-divider />

        <v-card-actions v-if="$vuetify.breakpoint.smAndDown">
          <v-flex xs12 text-xs-center>
            <div>
              <v-btn color="primary" block flat @click="reset({ hostConfig: true })">Reset configuration</v-btn>
            </div>
            <div>
              <v-btn color="primary" block flat @click="reset({ hostConfig: true, scenesList: true })">Reset everything</v-btn>
            </div>

            <div class="mt-4">
              <v-btn color="secondary" block flat @click="dialog = false">Cancel</v-btn>
            </div>
          </v-flex>
        </v-card-actions>

        <v-card-actions v-else>
          <v-btn color="secondary" flat @click="dialog = false">Cancel</v-btn>
          <v-spacer />
          <v-btn color="primary" flat @click="reset({ hostConfig: true })">Reset configuration</v-btn>
          <v-btn color="primary" flat @click="reset({ hostConfig: true, scenesList: true })">Reset everything</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ResetAppButton',
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    ...mapActions(['resetApp']),
    reset(toResetObj) {
      this.resetApp(toResetObj)
      this.dialog = false
    }
  }
}
</script>
