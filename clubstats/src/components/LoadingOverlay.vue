<template>
  <v-overlay :value="this.$store.state.loading">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'LoadingOverlay',
}
</script>
