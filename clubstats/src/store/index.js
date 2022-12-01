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
    players: [],
    scrapedPlayers: [],
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
  },

  mutations: {
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
        .then((response) => state.commit("setUser", response.data))
        .catch((err) => console.log(err));
    },

    //------------ Player ---------------
    async loadAllPlayers(state) {
      state.commit("startLoading");
      return axios
        .get("stats/players")
        .then((response) => {
          this.state.players = response.data;
          this.state.commit("stopLoading");
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
      this.state.commit("startLoading");
      return axios
        .put(`stats/players/${editedPlayer.player_id}`, editedPlayer)
        .then(() => {
          var result = this.state.players.findIndex((obj) => {
            return obj.player_id === editedPlayer.player_id;
          });

          const newPlayers = this.state.players;
          newPlayers[result] = editedPlayer;
          state.commit("setPlayers", newPlayers);
          this.state.commit("stopLoading");
        })
        .catch((err) => console.log(err));
    },

    async createPlayer(state, newPlayer) {
      return axios
        .post("stats/players", newPlayer)
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
        .get("stats/script", { params: { link: link } })
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
      return axios
        .put("stats/update", players)
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

