<template>
  <div>
    <v-container grid-list-md text-xs-center fluid>
      <v-layout row wrap>
        <v-flex xs6>
          <v-card dark color="primary">
            <v-card-text class="px-0">Experience image</v-card-text>
            <v-img src="https://diran.univ-littoral.fr/api/images/Appart1opt02/appartAopt_00900.png" />
          </v-card>
        </v-flex>
        <v-flex xs6>
          <v-card dark color="primary">
            <v-card-text>Reference image</v-card-text>
            <v-img src="https://diran.univ-littoral.fr/api/images/Appart1opt02/appartAopt_00900.png" />
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { API_ROUTES } from '@/functions'

export default {
  name: 'ExperimentWithReference',
  props: {
    sceneId: {
      type: String,
      required: true
    }
  },
  computed: {
  },
  async mounted() {
    await this.getExtracts()
  },
  methods: {
    async getExtracts() {
      const scenes = await fetch(`${this.getHostURI}${API_ROUTES.getImage()}`).then(res => res.json())
    }
  }
}
</script>
