<template>
  <div>
    Select a scene for the experiment "{{ experimentName }}"

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
                  <v-btn flat round :to="aScene.experimentLink">Start experiment</v-btn>
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
import { API_ROUTES } from '@/functions'

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
      scenes: []
    }
  },
  computed: {
    ...mapState(['scenesList', 'progression']),
    ...mapGetters(['getHostURI'])
  },
  async mounted() {
    for (const aScene of this.scenesList) {
      const { data: thumb } = await fetch(`${this.getHostURI}${API_ROUTES.getImage(aScene, 'max')}`)
        .then(res => res.json())

      let sceneObj = {
        name: thumb.sceneName,
        thumbLink: `${this.getHostURI}${thumb.link}`,
        experimentLink: `/experiments/${this.experimentName}/${thumb.sceneName}`
      }
      if (this.progression[this.experimentName] && this.progression[this.experimentName][thumb.sceneName]) {
        const obj = this.progression[this.experimentName][thumb.sceneName]
        if (obj.done)
          sceneObj.progression = 'done'
        else if (Object.entries(obj.data).length !== 0 && obj.constructor === Object)
          sceneObj.progression = 'working'
        else
          sceneObj.progression = 'todo'
      }
      this.scenes.push(sceneObj)
    }
  }
}
</script>
