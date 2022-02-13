import { createStore } from "vuex";
import axios from "axios";

axios.defaults.baseURL = "https://localhost:3001/";

export default createStore({
  state: {
    players: [],
  },
  mutations: {},
  actions: {
    async loadAllPlayers() {
      axios
        .get("stats/players")
        .then((response) => {
          this.players = response;
        })
        .catch((err) => console.log(err));
    },
  },
  modules: {},
});
