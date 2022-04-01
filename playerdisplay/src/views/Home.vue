<template>
  <div class="home">
    <h1>Player List</h1>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      players: [],
    }
  },
  components: {
  },
  async created() {
    await this.$store.dispatch("loadAllPlayers");
    this.players = this.$store.getters.players;
  },
  methods: {
  },
}
</script>

<style>

</style>
