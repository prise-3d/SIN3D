<template>
  <div>
    <v-layout justify-start>
      <v-btn flat exact :to="`/experiments`">
        <v-icon left>arrow_back</v-icon>
        Back to experiment selection
      </v-btn>
    </v-layout>

    Select a scene for the experiment "{{ experimentFullName }}"

    <v-card>
      <v-container
        fluid
        grid-list-md
      >
        <v-layout row wrap>
          <v-flex
            v-for="aScene in scenes"
            :key="aScene.name"
          >
            <v-card>
              <v-img
                :src="aScene.thumbLink"
                height="200px"
              />
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{ aScene.name }}</div>
                </div>
                <v-card-actions>
                  <v-chip v-if="aScene.progression === 'done'" color="green" text-color="white" small>
                    <v-avatar class="green darken-4">
                      <v-icon>check</v-icon>
                    </v-avatar>
                    <span>Validated</span>
                  </v-chip>
                  <v-chip v-else-if="aScene.progression === 'working'" color="orange" text-color="white" small>
                    <v-avatar class="orange darken-4">
                      <v-icon>edit</v-icon>
                    </v-avatar>
                    <span>Started but not validated</span>
                  </v-chip>
                  <v-chip v-else-if="aScene.progression === 'todo'" color="red" text-color="white" small>
                    <v-avatar class="red darken-4">
                      <v-icon>close</v-icon>
                    </v-avatar>
                    <span>Not started</span>
                  </v-chip>
                </v-card-actions>
                <v-spacer />
                <v-card-actions>
                  <v-btn round :disabled="aScene.progression === 'done'" :to="aScene.experimentLink">Start experiment</v-btn>
                </v-card-actions>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Experiments from '@/router/experiments'
import { API_ROUTES, shuffleArray } from '@/functions'
import { getExperimentSceneList } from '@/config.utils'

export default {
  name: 'SelectExperimentScene',
  props: {
    experimentName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      scenes: [],
      experimentFullName: null
    }
  },
  computed: {
    ...mapState(['progression']),
    ...mapGetters(['getHostURI'])
  },
  async mounted() {
    const scenesList = getExperimentSceneList(this.experimentName)

    // Find the selected experiment full name
    this.experimentFullName = Experiments.find(x => x.name === this.experimentName).meta.fullName

    // Order each scene by progression group, random sort in each group
    let todo = []
    let working = []
    let done = []

    for (const aScene of scenesList) {
      const { data: thumb } = await fetch(`${this.getHostURI}${API_ROUTES.getImage(aScene, 'max')}`)
        .then(res => res.json())

      let sceneObj = {
        name: thumb.sceneName,
        thumbLink: `${this.getHostURI}${thumb.link}`,
        experimentLink: `/experiments/${this.experimentName}/${thumb.sceneName}`
      }
      if (this.progression[this.experimentName] && this.progression[this.experimentName][thumb.sceneName]) {
        const obj = this.progression[this.experimentName][thumb.sceneName]
        if (obj.done) {
          sceneObj.progression = 'done'
          done.push(sceneObj)
        }
        else if (Object.entries(obj.data).length !== 0 && obj.constructor === Object) {
          sceneObj.progression = 'working'
          working.push(sceneObj)
        }
        else {
          sceneObj.progression = 'todo'
          todo.push(sceneObj)
        }
      }
    }
    // Randomize each group
    todo = shuffleArray(todo)
    working = shuffleArray(working)
    done = shuffleArray(done)

    // Render the scenes, in the following order : working, todo, done
    this.scenes = this.scenes.concat(working, todo, done)
  }
}
</script>
