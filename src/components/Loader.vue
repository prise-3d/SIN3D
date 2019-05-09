<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center style="flex-direction: column">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        />
        <div class="mt-3" v-if="message">{{ message }}</div>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    message: {
      type: String,
      default: null,
      required: false
    }
  }
}
</script>
