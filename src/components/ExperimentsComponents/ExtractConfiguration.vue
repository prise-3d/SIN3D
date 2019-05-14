<template>
  <v-card dark>
    <v-container grid-list-sm fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <h1>Configuration</h1>

          <v-slide-y-transition mode="out-in">
            <div v-if="isExpanded" key="configurator">
              <v-card-text class="px-0">Extracts per line (horizontal)</v-card-text>
              <v-slider
                v-model="experimentConfig.x"
                always-dirty
                persistent-hint
                thumb-label="always"
                min="1"
                max="15"
              />

              <v-card-text class="px-0">Extracts per row (vertical)</v-card-text>
              <v-slider
                v-model="experimentConfig.y"
                always-dirty
                persistent-hint
                thumb-label="always"
                min="1"
                max="15"
              />

              <v-btn @click="setConfig" :disabled="!isConfigNew">Confirm</v-btn>
            </div>
            <div v-else key="arrow">
              <v-btn flat round @click="isExpanded = true">
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </div>
          </v-slide-y-transition>

          <v-alert v-if="loadingErrorMessage" :value="true" type="error" v-text="loadingErrorMessage" />
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: 'ExtractConfiguration',
  props: {
    loadingErrorMessage: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      isExpanded: true,

      // Experiment config sliders
      experimentConfig: {
        x: 4,
        y: 4
      },
      // Updated when `setConfig` is called
      extractConfig: {
        x: 4,
        y: 4
      }
    }
  },
  computed: {
    isConfigNew() {
      return this.extractConfig.x !== this.experimentConfig.x || this.extractConfig.y !== this.experimentConfig.y
    }
  },
  methods: {
    setVisibility(bool) {
      this.isExpanded = bool
    },

    setDefaultConfig(config) {
      this.experimentConfig.x = config.x
      this.experimentConfig.y = config.y
      this.extractConfig.x = this.experimentConfig.x
      this.extractConfig.y = this.experimentConfig.y
    },
    setConfig() {
      this.extractConfig.x = this.experimentConfig.x
      this.extractConfig.y = this.experimentConfig.y
      this.$emit('setConfig', this.experimentConfig)
    }
  }
}
</script>
