<template>
  <v-app>
    <NavBar />
    <v-main>
      <v-container
        class="spacing-playground pa-6"
        fluid
      >
        <ErrorAlert></ErrorAlert>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ErrorAlert from "@/components/ErrorAlert"
import NavBar from "@/components/NavBar"

export default {
  name: 'App',

  data: () => ({
    //
  }),
  mounted() {
    const user = sessionStorage.getItem("user");
    if (user !== "null" && user !== null) {
      const user = {
        Username: sessionStorage.getItem("user"),
        token: sessionStorage.getItem("token"),
      }
      this.$store.commit("setUser", user);
    }
  },
  components: {
    ErrorAlert,
    NavBar
  }
};
</script>

<style>
  .v-btn {
    margin-left: 15px;

  }
</style>