<template>
  <h1>Create Player</h1>
</template>

<script>
import store from "../store/index.js"

export default {
  name: 'Create',
  data() {
    const dialog = useDialog();
    const message = useMessage();
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
