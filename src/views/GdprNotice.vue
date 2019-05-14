<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm5>
      <v-card>
        <v-container fluid fill-height>
          <v-layout column align-center>
            <v-card-title class="headline d-block text-md-center font-weight-bold">GDPR notice</v-card-title>

            <v-card-text>
              We collect data...
              <br><br>
              Reprehenderit consectetur proident culpa id quis irure. Culpa adipisicing Lorem esse adipisicing ullamco nostrud mollit excepteur. Ut adipisicing labore commodo irure cillum incididunt reprehenderit do minim ea. Adipisicing nisi laboris laboris eu commodo anim Lorem tempor mollit. Aliqua minim magna incididunt cillum dolore irure. Nostrud quis aute consectetur id. Dolor cillum aute dolor irure id consectetur commodo pariatur elit irure pariatur occaecat consequat cupidatat.
              <br><br>
              Consequat est laboris aliqua culpa fugiat Lorem ad sit nisi. Dolore exercitation voluptate ex labore id proident nulla nulla incididunt deserunt laborum do ipsum. Consectetur fugiat Lorem pariatur ea irure cillum dolor voluptate velit tempor ex reprehenderit proident.
            </v-card-text>

            <v-btn color="primary" @click="setGdprValidated">I accept the data collection</v-btn>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'GdprNotice',
  methods: {
    ...mapActions(['setGdprValidated'])
  }
}
</script>
