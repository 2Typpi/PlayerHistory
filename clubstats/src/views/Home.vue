<template>
  <div v-if="this.$store.getters.user === null">
    <MissingRole></MissingRole>
  </div>
  <div v-else class="home">
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
          <h2>Spieler Liste</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Suche"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
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
                        v-model="editedItem.Name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.Games"
                        label="Spiele"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.Goals"
                        label="Tore"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.YellowCards"
                        label="Gelbe Karten"
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
                  Abbrechen
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Speichern
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Sind sie sich sicher, dass sie diesen Spieler löschen möchten?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Abbrechen</v-btn>
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
  </div>
</template>

<script>
import MissingRole from '@/components/MissingRole';

export default {
  name: 'home-view',
  data() {
    return {
      overlay: true,
      dialog: false,
      dialogDelete: false,
      players: [],
      headers: [
          { text: 'Name', value: 'Name' },
          { text: 'Spiele', value: 'Games' },
          { text: 'Tore', value: 'Goals' },
          { text: 'Gelbe Karten', value: 'YellowCards' },
          { text: 'Gelb-Rote Karten', value: 'YellowRedCards' },
          { text: 'Rote Karten', value: 'RedCards' },
          { text: 'Aktionen', value: 'actions', sortable: false },
        ],
      search: '',
      editedIndex: -1,
      editedItem: {
        Name:"",
        Games:0,
        Goals:0,
        RedCards:0,
        YellowCards:0,
        YellowRedCards:0,
        player_id:"",
      },
      defaultItem: {
        Name:"",
        Games:0,
        Goals:0,
        RedCards:0,
        YellowCards:0,
        YellowRedCards:0,
        player_id:"",
      },
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Neuer Spieler' : 'Editiere Spieler'
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
  components: {
    MissingRole
  },
  async created() {
    await this.$store.dispatch("loadAllPlayers");
    this.players = this.$store.getters.players;
  },
  methods: {
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
      this.$store.dispatch("delPlayer", this.editedItem.player_id)
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
        this.$store.dispatch("editPlayer", this.editedItem)
      } else {
        this.$store.dispatch("createPlayer", this.editedItem)
        this.players.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>

<style>

</style>
