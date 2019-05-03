<template>
  <v-card>
    <v-snackbar
      v-model="isVisible"
      :color="level"
      :timeout="timeout"
      multi-line
    >
      {{ text }}
      <v-btn
        dark
        flat
        @click="isVisible = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  name: 'ToastMessage',
  data() {
    return {
      text: '',
      level: 'success',
      timeout: 4000,
      isVisible: false
    }
  },
  methods: {
    /**
     * Briefly show a toast message
     *
     * @param {String} text toast to show
     * @param {('info'|'success'|'error')} [level='success'] toast type
     * @param {Number} [timeout=4000] amount of time the toast will be visible
     * @returns {void}
     */
    show(text, level = 'success', timeout = 4000) {
      this.text = text
      this.level = level
      this.timeout = timeout
      this.isVisible = true
    }
  }
}
</script>
