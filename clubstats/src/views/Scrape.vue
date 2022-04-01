<template>
  <h1>Daten vom BFV holen</h1>
</template>

<script>
import store from "../store/index.js"

export default {
  name: 'scrape-view',
  data() {
    return {
    };
  },
  components: {
  },
  async created() {
    this.players = store.getters.players;
  },
  methods: {
  },
}
</script>

<style>

</style>
