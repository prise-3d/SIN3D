<template>
  <div :class="{ 'bigger-table': $vuetify.breakpoint.lgAndUp }">
    List of experiences


    <v-card>
      <v-card-title>
        Choose an experience
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        v-if="items"
        :headers="headers"
        :items="items"
        :search="search"
        :pagination.sync="pagination"
      >
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.completion }}</td>
          <td class="text-xs-center"><v-btn small dark :to="props.item.link">Start experience</v-btn></td>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Experiences from '@/router/experiences'

export default {
  name: 'ExperiencesList',
  data() {
    return {
      search: '',
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: 'Experience name', value: 'name' },
        { text: 'Completion', value: 'completion', align: 'center' },
        { text: 'Start', value: 'name', sortable: false, align: 'center' }
      ],
      items: null
    }
  },
  computed: {
    ...mapState(['scenesList', 'progression'])
  },
  mounted() {
    this.items = Experiences.map(x => {
      const res = {
        name: x.fullName,
        link: x.path
      }
      // Check cache has an entry for each scenes in this experience
      if (this.progression[x.name] && Object.keys(this.progression[x.name]).every(y => this.scenesList.includes(this.progression[x.name][y])))
        res.completion = `${Object.keys(this.progression[x.name]).filter(y => this.progression[x.name][y]).length / this.scenesList.length * 100}%`
      else res.completion = '0%'

      return res
    })
  }
}
</script>

<style scoped>
.bigger-table {
  width: 50%;
}
</style>
