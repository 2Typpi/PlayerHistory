<template>
  <div v-if="this.$store.getters.user === null">
    <MissingRole></MissingRole>
  </div>
  <div v-else>
    <h1>Daten vom BFV holen</h1>
    <v-card class="d-flex align-center pa-2 justify-space-around" flat>
      <v-row>
        <v-col cols="10">
          <v-text-field v-model="link" label="Link zum Spiel in BFV"></v-text-field>
        </v-col>

        <v-col cols="2" class="d-flex align-center">
          <v-btn color="primary" v-on:click="scrapeStats">Lade Statistiken</v-btn>
          <v-btn color="primary" v-on:click="saveToDb">Speichern</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="this.players"
      :search="search"
      :items-per-page = "-1"
      hide-default-footer>
        <template v-slot:top>
        <v-toolbar
          flat
        >
        <h2>Spieler aus dem Spiel</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="700px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Neuer Spieler
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.games"
                        label="Spiele"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.goals"
                        label="Tore"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.yellow_cards"
                        label="Gelbe Karten"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.yellow_red_cards"
                        label="Gelb-Rote Karten"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.red_cards"
                        label="Rote Karten"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-subheader>No data found</v-subheader>
      </template>
    </v-data-table>
    <v-snackbar
      absolute
      right
      top
      :color="this.snackbarColor"
      v-model="snackbar"
    >
      {{ text }}
        <v-btn
          color="black"
          text
          v-bind="this.text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import MissingRole from '@/components/MissingRole';

export default {
  name: 'scrape-view',
  data() {
    return {
      defaultItem: {
        name:"",
        games:0,
        goals:0,
        red_cards:0,
        yellow_cards:0,
        yellow_red_cards:0,
        player_id:"",
      },
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name:"",
        games:0,
        goals:0,
        red_cards:0,
        yellow_cards:0,
        yellow_red_cards:0,
        player_id:"",
      },
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Spiele', value: 'games' },
        { text: 'Tore', value: 'goals' },
        { text: 'Gelbe Karten', value: 'yellow_cards' },
        { text: 'Gelb-Rote Karten', value: 'yellow_red_cards' },
        { text: 'Rote Karten', value: 'red_cards' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      link: '',
      players: [],
      search: '',
      snackbar: false,
      snackbarColor: "",
      text: "",
    }
  },
  components: {
    MissingRole
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  methods: {
    async scrapeStats () {
      await this.$store.dispatch("activateScript", this.link)
      this.players = this.$store.getters.scrapedPlayers;
    },
    editItem (item) {
      this.editedIndex = this.players.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.players.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.players.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.players[this.editedIndex], this.editedItem)
      } else {
        this.players.push(this.editedItem)
      }
      this.close()
    },
    saveToDb() {
      this.$store.dispatch("addToStats", this.players)
        .then((code) => {
          this.players = []
          if(code < 0) {
            this.text = "Irgendwas ist schiefgelaufen! Die Daten bitte von Hand eintragen und melden"
            this.snackbarColor = "red"
            this.snackbar = true
          } else {
            this.text = "Erfolgreich gespeichert"
            this.snackbarColor = "green"
            this.snackbar = true
          }
        })
    }
  },
}
</script>

<style>

</style>
