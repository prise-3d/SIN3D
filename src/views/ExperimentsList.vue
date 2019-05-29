<template>
  <div>
    List of experiments

    <v-card>
      <v-card-title>
        Choose an experiment
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
          <td class="text-xs-center"><v-btn small dark :to="props.item.link">Start experiment</v-btn></td>
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
import Experiments from '@/router/experiments'
import { getExperimentSceneList } from '@/config.utils'

export default {
  name: 'ExperimentsList',
  data() {
    return {
      search: '',
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: 'Experiment name', value: 'name' },
        { text: 'Completion', value: 'completion', align: 'center' },
        { text: 'Start', value: 'name', sortable: false, align: 'center' }
      ],
      items: null
    }
  },
  computed: {
    ...mapState(['progression'])
  },
  mounted() {
    this.items = Experiments.map(expe => {
      const scenesList = getExperimentSceneList(expe.name)
      const res = {
        name: expe.meta.fullName,
        link: `/experiments/${expe.name}`
      }
      // Check cache has an entry for each scenes in this experiment
      if (this.progression && this.progression[expe.name]) {
        // Set experiment completion percentage
        const numberOfDoneScenes = Object.keys(this.progression[expe.name]).filter(y => this.progression[expe.name][y].done).length
        const percentage = Math.round(numberOfDoneScenes / scenesList.length * 100)
        res.completion = `${percentage}%`
      }
      else res.completion = '0%'

      return res
    })
  }
}
</script>
