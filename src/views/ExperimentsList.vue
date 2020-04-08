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
          <td class="text-xs-center"><v-btn small dark :to="props.item.link">Start</v-btn></td>
          <td class="text-xs-center"><v-btn small dark :to="props.item.linkRandom">Start with random scene</v-btn></td>
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
import { mapGetters } from 'vuex'
import Experiments from '@/router/experiments'
import { getExperimentSceneList } from '@/config.utils'
import { rand } from '@/functions'

export default {
  name: 'ExperimentsList',
  data() {
    return {
      search: '',
      pagination: { rowsPerPage: 10 },
      headers: [
        { text: 'Experiment name', value: 'name' },
        { text: 'Completion', value: 'completion', align: 'center' },
        { text: 'Start', value: 'start', sortable: false, align: 'center' },
        { text: 'Start random scene', value: 'startRandom', sortable: false, align: 'center' }
      ],
      items: null
    }
  },
  computed: {
    ...mapGetters(['getAllExperimentProgress'])
  },
  mounted() {
    this.items = Experiments.map(expe => {
      const scenesList = getExperimentSceneList(expe.name)
      const res = {
        name: expe.meta.fullName,
        link: `/experiments/${expe.name}`
      }

      // load current user progression
      this.progression = this.getAllExperimentProgress()

      // Check cache has an entry for each scenes in this experiment
      if (this.progression && this.progression[expe.name]) {
        // Set experiment completion percentage
        const numberOfDoneScenes = Object.keys(this.progression[expe.name]).filter(y => this.progression[expe.name][y].done).length
        const percentage = Math.round(numberOfDoneScenes / scenesList.length * 100)
        res.completion = `${numberOfDoneScenes}/${scenesList.length} - ${percentage}%`

        // Get scenes that are NOT done
        const unDoneScenes = Object.keys(this.progression[expe.name]).filter(y => scenesList.includes(y) && !this.progression[expe.name][y].done)
        // Select a random scenes
        const randomScene = unDoneScenes[rand(0, unDoneScenes.length - 1)]
        res.linkRandom = `/experiments/${expe.name}/${randomScene}`
      }
      else res.completion = '0%'

      return res
    })
  }
}
</script>
