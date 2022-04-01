<template>
  <div class="home">
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
          <v-toolbar-title>Player List</v-toolbar-title>
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
                New Item
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
                        v-model="editedItem.FirstName"
                        label="Vorname"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.LastName"
                        label="Nachname"
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
  </div>
</template>

<script>

export default {
  name: 'home-view',
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      players: [],
      headers: [
          { text: 'Vorname', value: 'FirstName' },
          { text: 'Nachname', value: 'LastName' },
          { text: 'Spiele', value: 'Games' },
          { text: 'Tore', value: 'Goals' },
          { text: 'Gelbe Karten', value: 'YellowCards' },
          { text: 'Gelb-Rote Karten', value: 'YellowRedCards' },
          { text: 'Rote Karten', value: 'RedCards' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      search: '',
      editedIndex: -1,
      editedItem: {
        FirstName:"",
        Games:0,
        Goals:0,
        LastName:"",
        RedCards:0,
        YellowCards:0,
        YellowRedCards:0,
        player_id:"",
      },
      defaultItem: {
        FirstName:"",
        Games:0,
        Goals:0,
        LastName:"",
        RedCards:0,
        YellowCards:0,
        YellowRedCards:0,
        player_id:"",
      },
    }
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
  components: {
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
        //TODO: Add Player in DB
        this.players.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>

<style>

</style>
