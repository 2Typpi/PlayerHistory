<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field prepend-icon="mdi-account" name="login" label="Login" type="text" v-model="user.Username" v-on:keyup.enter="doLogin" :rules="[rules.validated]">
                </v-text-field>
                <v-text-field prepend-icon="mdi-lock" name="password" label="Password" type="password" v-model="user.Password" v-on:keyup.enter="doLogin" :rules="[rules.validated]">
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark v-on:click="doLogin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>

export default {
  name: 'login-view',
  props: {
    source: String,
  },
  data() {
    return {
      user: {
        Username: "",
        Password: "",
      },
      valid: true,
      rules: {
        validated: value => {
          this.valid = true
          return this.valid && !!value ? true : 'Benutzername oder Passwort ist falsch'
        }
      }
    }
  },
  watch: {
  },
  components: {
  },
  async created() {
  },
  methods: {
    doLogin() {
      this.$store.dispatch("login", this.user).then(() => {
        let user = this.$store.getters.user;
        if (user != null) {
          this.$router.push('/home')
        } else {
          this.user.Username = ""
          this.user.Password = ""
          this.valid = false
        }
      })
    },
  },
}
</script>

<style>

</style>
