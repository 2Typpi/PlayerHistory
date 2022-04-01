<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="TSV Babenhausen Wappen"
          class="shrink mr-2"
          contain
          src="../public/images/Babenhausen.png"
          transition="scale-transition"
          width="40"
        />

        <h1>TSV Babenhausen - Club History</h1>
      </div>
      <v-spacer></v-spacer>

      <v-btn to="/scrape">
        BFV Daten
        <v-icon right dark>mdi-cloud-download</v-icon>
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
};
</script>
