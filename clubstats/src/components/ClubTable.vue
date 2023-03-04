<template>
  <v-data-table :headers="headersClub" :items="this.clubs" :search="searchClub" :items-per-page="-1" hide-default-footer>
    <template v-slot:top>
      <v-toolbar flat>
        <h2>Club Liste</h2>
        <v-spacer></v-spacer>
        <v-text-field v-model="searchClub" append-icon="mdi-magnify" label="Suche" single-line
          hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogClub" max-width="1000px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Neuer Club
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
                    <v-text-field v-model="editedClubItem.Name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedClubItem.SecondTeam" label="2. Mannschaft"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedClubItem.ThirdTeam" label="3. Mannschaft"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      label="Select a Username"
                      v-model="editedClubItem.username"
                      :items="usernames"
                      variant="underlined"
                    ></v-select>
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
        <v-dialog v-model="dialogDeleteClub" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Sind sie sich sicher, dass sie diesen Club löschen
              möchten?</v-card-title>
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
      <v-icon small class="mr-2" @click="editClubItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteClubItem(item)">
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
  name: 'ClubTable',
  data() {
    return {
      dialogClub: false,
      dialogDeleteClub: false,
      clubs: [],
      usernames: [],
      headersClub: [
        { text: 'Club-ID', value: 'club_id' },
        { text: 'Name', value: 'Name' },
        { text: '2. Mannschaft', value: 'SecondTeam' },
        { text: '3. Mannschaft', value: 'ThirdTeam' },
        { text: 'User-ID', value: 'user.Username' },
        { text: 'Aktionen', value: 'actions', sortable: false },
      ],
      searchClub: '',
      editedClubIndex: -1,
      editedClubItem: {
        club_id: "",
        Name: "",
        SecondTeam: "",
        ThirdTeam: "",
        username: "",
      },
      defaultClubItem: {
        club_id: "",
        Name: "",
        SecondTeam: "",
        ThirdTeam: "",
        username: "",
      },
    }
  },
  computed: {
    formTitle() {
      return this.editedClubIndex === -1 ? 'Neuer Club' : 'Editiere Club'
    },
  },
  watch: {
    dialogClub(val) {
      val || this.close()
    },
    dialogDeleteClub(val) {
      val || this.closeDelete()
    },
  },
  async created() {
    await this.$store.dispatch("loadAllClubs");
    await this.$store.dispatch("loadAllUsers");
    this.clubs = this.$store.getters.allClubs;
    this.usernames = this.$store.getters.allUsers.map((user) => user.Username);
  },
  methods: {
    editClubItem(item) {
      this.editedClubIndex = this.clubs.indexOf(item)
      this.editedClubItem = Object.assign({}, item)
      this.editedClubItem.username = item.user.Username
      this.dialogClub = true
    },

    deleteClubItem(item) {
      this.editedClubIndex = this.clubs.indexOf(item)
      this.editedClubItem = Object.assign({}, item)
      this.dialogDeleteClub = true
    },

    deleteItemConfirm() {
      this.$store.dispatch("delClub", this.editedClubItem.club_id)
      this.closeDelete()
    },

    close() {
      this.dialogClub = false
      this.$nextTick(() => {
        this.editedClubItem = Object.assign({}, this.defaultClubItem)
        this.editedClubIndex = -1
      })
    },

    closeDelete() {
      this.dialogDeleteClub = false
      this.$nextTick(() => {
        this.editedClubItem = Object.assign({}, this.defaultClubItem)
        this.editedClubIndex = -1
      })
    },

    save() {
      if (this.editedClubIndex > -1) {
        Object.assign(this.clubs[this.editedClubIndex], this.editedClubItem)
        this.$store.dispatch("editClub", this.editedClubItem)
      } else {
        this.$store.dispatch("createClub", this.editedClubItem)
        this.clubs.push(this.editedClubItem)
      }
      this.close()
    },
  },
}
</script>