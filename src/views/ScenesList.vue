<template>
  <div>
    Scenes list
    <v-card>
      <v-container
        fluid
        grid-list-md
      >
        <v-layout row wrap>
          <v-flex
            md3
            v-for="aScene in scenes"
            :key="aScene.name"
          >
            <v-card>
              <a
                :href="aScene.qualitiesLink"
              >
                <v-img
                  :src="aScene.thumbLink"
                  height="200px"
                />
              </a>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{ aScene.name }}</div>
                </div>
                <v-spacer />
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>

import { API_ROUTES } from '@/functions'
import { mapGetters } from 'vuex'

export default {
  name: 'ScenesList',
  data() {
    return {
      scenes: []
    }
  },
  computed: {
    ...mapGetters(['getHostURI'])
  },
  async mounted() {
    // define empyt scenes list
    this.scenes = []

    const scenesList = await fetch(`${this.getHostURI}${API_ROUTES.listScenes}`)
      .then(res => res.json())

    for (const aScene of scenesList.data) {
      const { data: thumb } = await fetch(`${this.getHostURI}${API_ROUTES.getImage(aScene, 'max')}`).then(res => res.json())

      let sceneObj = {
        name: thumb.sceneName,
        thumbLink: `${this.getHostURI}${thumb.link}`,
        qualitiesLink: `${this.getHostURI}${API_ROUTES.listSceneQualities(aScene)}`
      }

      this.scenes.push(sceneObj)
    }
  }
}
</script>
