import { createStore } from "vuex";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001/";

export default createStore({
  state: {
    players: [],
  },
  getters: {
    players: (state) => {
      return state.players;
    },
  },
  mutations: {
    setPlayers(state, newPlayers) {
      state.players = newPlayers;
    },
  },
  actions: {
    async loadAllPlayers() {
      return axios
        .get("stats/players")
        .then((response) => {
          this.state.players = response.data;
        })
        .catch((err) => console.log(err));
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
  },
  modules: {},
});
