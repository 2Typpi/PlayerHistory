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

    .v-data-table__wrapper {
      height: 80vh;
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
    .v-data-table__wrapper {
      height: 75vh;
    }

    table > tbody > tr > td:nth-child(1),
    table > thead > tr > th:nth-child(1) {
      position: sticky !important;
      position: -webkit-sticky !important;
      left: 0;
      z-index: 3;
      background: white;
    }
    .v-data-table--fixed-header > .v-data-table__wrapper > table > thead > tr > th:nth-child(1) {
      z-index: 4;
    }
  }
</style>