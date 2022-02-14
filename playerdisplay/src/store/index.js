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
  mutations: {},
  actions: {
    async loadAllPlayers() {
      return axios
        .get("stats/players")
        .then((response) => {
          this.state.players = response.data;
        })
        .catch((err) => console.log(err));
    },
  },
  modules: {},
});
