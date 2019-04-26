<template>
  <v-app id="inspire" :dark="darkMode">
    <!-- Sidebar menu -->
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list dense>
        <v-list-tile to="/" exact>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/listScenes" exact>
          <v-list-tile-action>
            <v-icon>photo_library</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>List scenes</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!--/ Sidebar menu -->

    <!-- Top bar -->
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Web experience</v-toolbar-title>
    </v-toolbar>
    <!--/ Top bar -->

    <!-- Pages content -->
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-scroll-x-reverse-transition mode="out-in">
            <!-- View injected here -->
            <router-view />
            <!--/ View injected here -->
          </v-scroll-x-reverse-transition>
        </v-layout>
      </v-container>
    </v-content>
    <!--/ Pages content -->
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      darkMode: true,
      drawer: false
    }
  }
}
</script>
