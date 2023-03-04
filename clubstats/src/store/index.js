import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

//Configure authorization
axios.defaults.baseURL = "http://localhost:3001/";
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const store = new Vuex.Store({
  state: {
    club: null,
    allClubs: [],
    players: [],
    scrapedPlayers: [],
    allUsers: [],
    user: null,
    error: false,
    errMsg: "",
    loading: false,
  },

  getters: {
    players: (state) => {
      return state.players;
    },

    scrapedPlayers: (state) => {
      return state.scrapedPlayers;
    },

    user: (state) => {
      return state.user;
    },

    allUsers: (state) => {
      return state.allUsers;
    },

    club: (state) => {
      return state.club;
    },

    allClubs: (state) => {
      return state.allClubs;
    },
  },

  mutations: {
    setClub(state, club) {
      if (club !== null) {
        sessionStorage.setItem("clubname", club.Name);
      }
      state.club = club;
    },

    setAllClubs(state, allClubs) {
      state.allClubs = allClubs;
    },

    setPlayers(state, newPlayers) {
      state.players = newPlayers;
    },

    setScrapedPlayers(state, newPlayers) {
      state.scrapedPlayers = newPlayers;
    },

    setUser(state, user) {
      if (user !== null) {
        sessionStorage.setItem("token", user.token);
        sessionStorage.setItem("user", user.Username);
      }
      state.user = user;
    },

    setAllUser(state, allUsers) {
      state.allUsers = allUsers;
    },

    raiseErrMsg(state, errMsg) {
      state.error = true;
      state.errMsg = errMsg;
    },

    dismissErr(state) {
      state.error = false;
      state.errMsg = "";
    },

    startLoading(state) {
      state.loading = true;
    },

    stopLoading(state) {
      state.loading = false;
    },
  },

  actions: {
    //------------ User ---------------
    async login(state, user) {
      return axios
        .post("user/authenticate", user)
        .then((response) => {
          state.commit("setUser", response.data);
        })
        .catch((err) => console.log(err));
    },

    async loadAllUsers(state) {
      return axios
        .get("user")
        .then((response) => {
          state.commit("setAllUser", response.data);
        })
        .catch((err) => console.log(err));
    },

    async editUser(state, editedUser) {
      state.commit("startLoading");
      return axios
        .put(`user/${editedUser.user_id}`, editedUser)
        .then(() => {
          var result = this.state.allUsers.findIndex((obj) => {
            return obj.user_id === editedUser.user_id;
          });

          const updatedUser = this.state.allUsers;
          updatedUser[result] = editedUser;
          state.commit("setAllUser", updatedUser);
          state.commit("stopLoading");
        })
        .catch((err) => console.log(err));
    },

    async delUser(state, uuid) {
      return axios
        .delete(`user/${uuid}`)
        .then(() => {
          var result = this.state.allUsers.findIndex((obj) => {
            return obj.user_id === uuid;
          });

          const newUsers = this.state.allUsers;
          newUsers.splice(result, 1);
          state.commit("setAllUser", newUsers);
        })
        .catch((err) => console.log(err));
    },
    //------------ Club ---------------
    async loadClub(state) {
      state.commit("startLoading");
      let username = encodeURIComponent(sessionStorage.getItem("user"));
      return await axios
        .get(`club/user/${username}`)
        .then((response) => {
          state.commit("setClub", response.data);
          state.commit("stopLoading");
        })
        .catch((err) => {
          state.commit("stopLoading");
          state.commit(
            "raiseErrMsg",
            "Ein Fehler beim Laden der Spieler ist aufgetreten. Bitte versuchen sie es erneut oder melden sie den Vorfall."
          );
          console.log(err);
        });
    },

    async loadAllClubs(state) {
      state.commit("startLoading");
      return await axios
        .get(`club/`)
        .then((response) => {
          state.commit("setAllClubs", response.data);
          state.commit("stopLoading");
        })
        .catch((err) => {
          state.commit("stopLoading");
          state.commit(
            "raiseErrMsg",
            "Ein Fehler beim Laden der Spieler ist aufgetreten. Bitte versuchen sie es erneut oder melden sie den Vorfall."
          );
          console.log(err);
        });
    },

    async createClub(state, newClub) {
      //Remove empty player_id used for easy way of editing players
      delete newClub.club_id;

      return axios
        .post("club", newClub)
        .then(() => {
          var result = this.state.allClubs.findIndex((obj) => {
            return obj.club_id === newClub.club_id;
          });

          const updatedClubs = this.state.allClubs;
          updatedClubs[result] = newClub;
          state.commit("setAllClubs", updatedClubs);
        })
        .catch((err) => console.log(err));
    },

    async editClub(state, editedClub) {
      state.commit("startLoading");
      return axios
        .put(`club/${editedClub.club_id}`, editedClub)
        .then(() => {
          var result = this.state.allClubs.findIndex((obj) => {
            return obj.club_id === editedClub.club_id;
          });

          const updatedClubs = this.state.allClubs;
          updatedClubs[result] = editedClub;
          state.commit("setAllClubs", updatedClubs);
          state.commit("stopLoading");
        })
        .catch((err) => console.log(err));
    },

    async delClub(state, uuid) {
      return axios
        .delete(`club/${uuid}`)
        .then(() => {
          var result = this.state.allClubs.findIndex((obj) => {
            return obj.club_id === uuid;
          });

          const newClubs = this.state.allClubs;
          newClubs.splice(result, 1);
          state.commit("setAllClubs", newClubs);
        })
        .catch((err) => console.log(err));
    },

    //------------ Player ---------------
    async loadAllPlayersOfClub(state) {
      state.commit("startLoading");
      let encodedName = encodeURIComponent(this.state.club.Name);
      return axios
        .get(`stats/players/${encodedName}`)
        .then((response) => {
          this.state.players = response.data;
          state.commit("stopLoading");
        })
        .catch((err) => {
          state.commit("stopLoading");
          state.commit(
            "raiseErrMsg",
            "Ein Fehler beim Laden der Spieler ist aufgetreten. Bitte versuchen sie es erneut oder melden sie den Vorfall."
          );
          console.log(err);
        });
    },

    async delPlayer(state, uuid) {
      return axios
        .delete(`stats/players/${uuid}`)
        .then(() => {
          var result = this.state.players.findIndex((obj) => {
            return obj.player_id === uuid;
          });

          const newPlayers = this.state.players;
          newPlayers.splice(result, 1);
          state.commit("setPlayers", newPlayers);
        })
        .catch((err) => console.log(err));
    },

    async editPlayer(state, editedPlayer) {
      state.commit("startLoading");
      return axios
        .put(`stats/players/${editedPlayer.player_id}`, editedPlayer)
        .then(() => {
          var result = this.state.players.findIndex((obj) => {
            return obj.player_id === editedPlayer.player_id;
          });

          const newPlayers = this.state.players;
          newPlayers[result] = editedPlayer;
          state.commit("setPlayers", newPlayers);
          state.commit("stopLoading");
        })
        .catch((err) => console.log(err));
    },

    async createPlayer(state, newPlayer) {
      //Remove empty player_id used for easy way of editing players
      delete newPlayer.player_id;

      const reqbody = {
        "club": this.state.club.Name,
        "player": newPlayer,
      };
      console.log(reqbody);
      return axios
        .post("stats/players", reqbody)
        .then(() => {
          var result = this.state.players.findIndex((obj) => {
            return obj.player_id === newPlayer.player_id;
          });

          const newPlayers = this.state.players;
          newPlayers[result] = newPlayer;
          state.commit("setPlayers", newPlayers);
        })
        .catch((err) => console.log(err));
    },

    //------------ Script ---------------
    async activateScript(state, link) {
      state.commit("startLoading");
      return axios
        .post("stats/script", { link: link, club: sessionStorage.getItem("clubname") })
        .then((response) => {
          state.commit("stopLoading");
          state.commit("setScrapedPlayers", response.data);
        })
        .catch((err) => {
          state.commit("stopLoading");
          console.log(err);
          store.commit("raiseErrMsg", "Fehler beim Laden der Spieler! Bitte Link überprüfen.");
        });
    },

    async addToStats(state, players) {
      const reqbody = {
        "club": sessionStorage.getItem("clubname"),
        "players": players,
      };
      return axios
        .put("stats/update", reqbody)
        .then(() => {
          state.commit("setScrapedPlayers", []);
        })
        .catch((err) => console.log(err));
    },

    //------------ User Feedback ---------------
    dismissError(state) {
      state.commit("dismissErr");
    },
  },
  modules: {},
});

export default store;
