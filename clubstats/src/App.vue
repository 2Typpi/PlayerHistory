<template>
  <v-app>
    <NavBar :key="this.$store.state.club"/>
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
  .float-button {
    position: fixed !important;
    z-index: 4 !important;
    bottom: 2vh;
    right: 2vh;
  }

  .v-speed-dial--direction-top .v-speed-dial__list {
    align-items: end;
  }

  @media only screen and (min-width: 700px) {
    .hidden-desktop {
      display: none;
    }
  }
  @media only screen and (max-width: 1026px) {
    h1, h2, h3,
    h4, h5, h6 {
      font-size: 16px;
      font-size: 4vw;
    }

    .hidden-mobile {
      display: none;
    }
  }
</style>