<template>
  <div>
    <v-container grid-list-md text-xs-center fluid style="padding-top: 0px !important;">
      <v-layout row wrap>
        <!-- Experiment header -->

        <v-flex xs12>
          <!-- DISABLE : This part is commented to disable view of back scene selection button when starting scene experiment -->
          <!--
          <v-layout justify-start>
            <v-btn flat exact :to="`/experiments/${experimentName}`">
              <v-icon left>arrow_back</v-icon>
              Back to scene selection
            </v-btn>
          </v-layout>
          -->

          <h2 v-if="runExpe === true">"{{ $route.meta.fullName }}"</h2>
          <!-- <h3>{{ sceneName }}</h3> -->

          <slot name="header"></slot>
        </v-flex>
        <!--/ Experiment header -->

        <!-- Loading screen -->
        <loader v-if="loadingMessage" :message="loadingMessage" />
        <!--/ Loading screen -->

        <!-- Experiment -->
        <template v-else-if="!loadingErrorMessage">
          <slot name="content"></slot>
        </template>
        <!--/ Experiment -->
      </v-layout>
    </v-container>
  </div>
</template>


<script>
import Loader from '@/components/Loader.vue'

export default {
  name: 'ExperimentBlock',
  components: {
    Loader
  },
  props: {
    experimentName: {
      type: String,
      required: true
    },
    sceneName: {
      type: String,
      required: true
    },
    loadingMessage: {
      type: String,
      required: false,
      default: null
    },
    loadingErrorMessage: {
      type: String,
      required: false,
      default: null
    },
    runExpe: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>
