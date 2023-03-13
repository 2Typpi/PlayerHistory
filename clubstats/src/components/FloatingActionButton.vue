<template>
  <v-btn elevation="2" class="float-button hidden-desktop" fab color="primary" medium @click="$emit('editItem')">
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'FloatingActionButton'
}
</script>