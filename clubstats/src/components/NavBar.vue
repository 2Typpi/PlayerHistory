<template>
  <div>
    <v-app-bar v-if="this.$store.getters.user !== null" app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="hidden-desktop"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <a href="#/home">
          <v-img :alt="clubname" class="shrink mr-2" contain :src="getPngUrl()"
            transition="scale-transition" width="40" />
        </a>
        <h1>{{ clubname }}</h1>
      </div>
      <v-spacer></v-spacer>
    
      <v-btn class="hidden-mobile" to="/scrape">
        BFV Daten
        <v-icon right>mdi-cloud-download</v-icon>
      </v-btn>

      <v-btn class="hidden-mobile" v-if="isAdmin()" to="/management">
        Manage Clients
        <v-icon right>mdi-database</v-icon>
      </v-btn>
    
      <v-btn class="hidden-mobile" v-on:click="logout">
        Logout
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        nav
      >
        <v-list-item-group>
          <v-list-item to="/scrape">
            <v-list-item-title><v-icon left>mdi-cloud-download</v-icon>BFV Daten</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="isAdmin()" to="/management">
            <v-list-item-title><v-icon left>mdi-database</v-icon>Manage Clients</v-list-item-title>
          </v-list-item>

          <v-list-item v-on:click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      drawer: false,
      clubname: sessionStorage.getItem("clubname")
    }
  },
  methods: {
    isAdmin() {
      return sessionStorage.getItem("user") === 'admin'
    },
    logout() {
      sessionStorage.clear();
      this.$store.commit("setUser", null);
      this.$router.push('/');
    },
    getPngUrl() {
      var images = require.context('../../public/images', false, /\.png$/)
      return images('./' + sessionStorage.getItem("clubname") + ".png")
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>

<style>
  .v-btn {
    margin-left: 15px;
  }
</style>