<template>
  <div class="home">
    
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      players: Array,
    }
  },
  components: {
  },
  async created() {
    this.players = await this.$store.dispatch("loadAllPlayers");
    console.log(this.players);
  }
}
</script>
