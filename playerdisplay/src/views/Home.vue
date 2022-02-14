<template>
  <div class="home">
    <ul>
      <li v-for="player in this.$data.players" :key="player.player_id">
        {{ player.FirstName }}
      </li>
    </ul>
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
    console.log(this.players);
  }
}
</script>
