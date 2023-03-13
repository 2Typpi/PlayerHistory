<template>
  <v-speed-dial
    v-model="fab"
    transition="scale-transition"
    direction="top"
    class="float-button"
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="primary"
        dark
        fab
      >
        <v-icon v-if="fab">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-chevron-up
        </v-icon>
      </v-btn>
    </template>
    <v-btn
      fab
      dark
      small
      color="green"
      @click="$emit('add')"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="black"
      @click="$emit('save')"
    >
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="indigo"
      @click="$emit('scrape')"
    >
      <v-icon>mdi-cloud-download</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'SpeedDialButton',
  data() {
    return {
      fab: false,
    }
  },
}
</script>