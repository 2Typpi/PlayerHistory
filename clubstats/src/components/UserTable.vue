<template>
  <v-data-table :headers="headers" :items="this.users" :search="search" :items-per-page="-1" hide-default-footer>
    <template v-slot:top>
      <v-toolbar flat>
        <h2>Nutzer Liste</h2>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Suche" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogCreate" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Neuer User
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="createItem.Username" label="Username"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="createItem.Password" label="Password"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeCreate">
                Abbrechen
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Speichern
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Sind sie sich sicher, dass sie diesen Nutzer löschen möchten?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Abbrechen</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.Username" label="Username"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Abbrechen
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Speichern
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-subheader>No data found</v-subheader>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'UserTable',
  data() {
    return {
      overlay: true,
      dialog: false,
      dialogDelete: false,
      dialogCreate: false,
      users: [],
      headers: [
        { text: 'User-ID', value: 'user_id' },
        { text: 'Username', value: 'Username' },
        { text: 'Aktionen', value: 'actions', sortable: false },
      ],
      search: '',
      editedIndex: -1,
      editedItem: {
        Username: "",
      },
      defaultItem: {
        Username: "",
        Password: "",
      },
      createItem: {
        Username: "",
        Password: "",
      },
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Neuer User' : 'Editiere User'
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },
  async created() {
    await this.$store.dispatch("loadAllUsers");
    this.users = this.$store.getters.allUsers;
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$store.dispatch("delUser", this.editedItem.user_id)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeCreate() {
      this.dialogCreate = false
      this.$nextTick(() => {
        this.createItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
        this.$store.dispatch("editUser", this.editedItem)
        this.close()
      } else {
        this.$store.dispatch("createUser", this.createItem)
        this.users.push(this.createItem)
        this.closeCreate()
      }
    },
  },
}
</script>