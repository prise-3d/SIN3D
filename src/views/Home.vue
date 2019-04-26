<template>
  <div>
    Home page
    <div>
      <v-btn @click="decrement()">Decrement</v-btn>
      <v-btn @click="$store.commit('increment', -count)">Reset</v-btn>
      <v-btn @click="increment()">Increment</v-btn>
    </div>
    <div>
      {{ count }}
    </div>
    Count should stay in the same state if you reload the page/close your browser.
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Home',
  components: {},
  computed: {
    ...mapState(['count'])
  },
  methods: {
    ...mapActions(['increment', 'decrement'])
  }
}
</script>
