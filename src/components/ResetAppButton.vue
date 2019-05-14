<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="showDialog"
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


        <v-card-actions>
          <v-btn color="secondary" flat @click="showDialog = false">Cancel</v-btn>
          <v-spacer />
          <v-flex xs6>
            <v-select
              v-model="selectedItems"
              :items="items"
              label="Data to reset"
              multiple
              item-text="text"
              item-value="value"
              return-object
              single-line
              chips
              deletable-chips
            >
              <template v-slot:prepend-item>
                <v-list-tile ripple @click="toggle">
                  <v-list-tile-action>
                    <v-icon :color="selectedItems.length > 0 ? 'indigo darken-4' : ''">{{ icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Reset All</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider class="mt-2" />
              </template>
            </v-select>
          </v-flex>
          <v-btn color="primary" flat @click="reset" :disabled="!(selectedItems.length > 0)">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <toast-message ref="toast" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ToastMessage from '@/components/ToastMessage.vue'

export default {
  name: 'ResetAppButton',
  components: {
    ToastMessage
  },
  data() {
    return {
      showDialog: false,

      selectedItems: [],
      items: [
        { text: 'GDPR consent', value: 'gdprConsent' },
        { text: 'Host configuration', value: 'hostConfig' },
        { text: 'Progression', value: 'progression' }
      ]
    }
  },
  computed: {
    selectAll() {
      return this.selectedItems.length === this.items.length
    },
    selectSome() {
      return this.selectedItems.length > 0 && !this.selectAll
    },
    icon() {
      if (this.selectAll) return 'mdi-close-box'
      if (this.selectSome) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.selectAll) {
          this.selectedItems = []
        }
        else {
          this.selectedItems = this.items.slice()
        }
      })
    },

    ...mapActions(['resetApp']),
    reset() {
      const toReset = this.selectedItems.reduce((acc, x) => {
        acc[x.value] = true
        return acc
      }, {})
      try {
        this.resetApp(toReset)
        this.$refs.toast.show('Successfully reseted requested data')
        this.showDialog = false
      }
      catch (err) {
        console.error('Failed to reset the app', err)
        this.$refs.toast.show('Failed to reset the app. ' + err.message, 'error', 10000)
      }
      this.$router.push('/')
    }
  }
}
</script>
