<template>
  <v-app-bar v-if="this.$store.getters.user !== null" app color="primary" dark>
    <div class="d-flex align-center">
      <a href="#/home">
        <v-img :alt="clubname" class="shrink mr-2" contain :src="getPngUrl()"
          transition="scale-transition" width="40" />
      </a>
      <h1>{{ clubname }} - Club History</h1>
    </div>
    <v-spacer></v-spacer>
  
    <v-btn to="/scrape">
      BFV Daten
      <v-icon right>mdi-cloud-download</v-icon>
    </v-btn>

    <v-btn v-if="isAdmin()" to="/management">
      Manage Clients
      <v-icon right>mdi-database</v-icon>
    </v-btn>
  
    <v-btn v-on:click="logout">
      Logout
    </v-btn>
  
  </v-app-bar>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
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
  }
}
</script>