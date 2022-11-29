<template>
  <v-alert v-if="this.$store.state.error" type="error" @click="dismiss()">{{ this.$store.state.errMsg }}
    <v-btn icon @click="dismiss()">
      <v-icon small>mdi-close</v-icon>
    </v-btn>
  </v-alert>
</template>

<script>

export default {
  name: 'ErrorAlert',
  methods: {
    dismiss() {
      this.$store.dispatch('dismissError')
    }
  }
}
</script>
