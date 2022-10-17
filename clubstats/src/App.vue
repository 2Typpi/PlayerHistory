<template>
  <v-app>
    <v-app-bar
      v-if="this.$store.getters.user !== null"
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <a href="#/home">
          <v-img
            alt="TSV Babenhausen Wappen"
            class="shrink mr-2"
            contain
            src="../public/images/Babenhausen.png"
            transition="scale-transition"
            width="40"
          />
        </a>
        <h1>TSV Babenhausen - Club History</h1>
      </div>
      <v-spacer></v-spacer>

      <v-btn to="/scrape">
        BFV Daten
        <v-icon right>mdi-cloud-download</v-icon>
      </v-btn>

      <v-btn v-on:click="logout">
        Logout
      </v-btn>

    </v-app-bar>

    <v-main>
      <v-container
        class="spacing-playground pa-6"
        fluid
      >
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  methods: {
    logout() {
      sessionStorage.clear();
      console.log(sessionStorage);
      this.$store.commit("setUser", null);
      this.$router.push('/');
    }
  },
  mounted() {
    const user = sessionStorage.getItem("user");
    console.log(user)
    if (user !== "null" && user !== null) {
      const user = {
        Username: sessionStorage.getItem("user"),
        token: sessionStorage.getItem("token"),
      }
      this.$store.commit("setUser", user);
    }
  },
};
</script>

<style>
  .v-btn {
    margin-left: 15px;

  }
</style>