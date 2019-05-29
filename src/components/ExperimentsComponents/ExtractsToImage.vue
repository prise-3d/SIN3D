<template>
  <div>
    <template v-for="i in extractConfig.y">
      <v-layout row wrap :key="`row-${i}`">
        <v-flex
          v-for="(anExtract, index) in extractsSliced(i)"
          :key="`extract-${i}-${extractConfig.x}-${extractConfig.y}-${index}-${anExtract.quality}`"
          class="pa-0"
        >
          <v-card flat tile class="d-flex height100">
            <v-img :src="anExtract" />
          </v-card>
        </v-flex>
      </v-layout>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ExtractsToImage',
  props: {
    extractConfig: {
      type: Object,
      required: true
    },
    extracts: {
      type: Array,
      required: true
    }
  },
  computed: {
    extractsSliced() {
      return vForIndex => this.extracts.slice(this.extractConfig.x * (vForIndex - 1), (this.extractConfig.x * vForIndex))
    }
  }
}
</script>
