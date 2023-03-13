<template>
  <div v-if="this.$store.getters.user === null">
    <MissingRole></MissingRole>
  </div>
  <v-card flat v-else>
    <LoadingOverlay></LoadingOverlay>
    <v-dialog v-model="dialogLoad" max-width="500px">
      <v-card>
        <v-col cols="12">
          <v-text-field v-model="link" label="Link zum Spiel in BFV"></v-text-field>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeLoad">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="scrapeStats">Lade Statistiken</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SpeedDialButton @add="editItem(null)" @save="saveToDb()" @scrape="dialogLoad = true"></SpeedDialButton>
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
        <h2>Spieler</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Suche nach Spieler..."
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
                class="mb-2 hidden-mobile"
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
      <template v-slot:[`item.actions`]="{ item }">
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
  </v-card>
</template>

<script>
import MissingRole from '@/components/MissingRole';
import LoadingOverlay from '@/components/LoadingOverlay';
import SpeedDialButton from '@/components/SpeedDialButton';


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
      dialogLoad: false,
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
        { text: 'Aktionen', value: 'actions', sortable: false },
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
    MissingRole,
    LoadingOverlay,
    SpeedDialButton
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Neuer Spieler' : 'Editiere Spieler'
    },
  },
  watch: {
    closeLoad(val) {
      val || this.closeLoad();
    },
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
      this.dialogLoad = false
    },
    editItem (item) {
      this.dialog = true
      if (item !== null) {
        this.editedIndex = this.players.indexOf(item)
        this.editedItem = Object.assign({}, item)
      } else {
        this.editedIndex = -1
        this.editedItem = Object.assign({}, this.defaultItem)
      }

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

    closeLoad() {
      this.dialogLoad = false
      this.$nextTick(() => {
        this.link = ""
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
