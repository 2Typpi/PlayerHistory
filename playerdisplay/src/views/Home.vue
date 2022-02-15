<template>
  <div class="home">
    <n-space vertical size="large">
      <n-layout-header>
        <h1>Player List</h1>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <div class="table-container">
          <search-bar></search-bar>
          <n-data-table 
            size="large"
            :columns="columns"
            bordered="false"
            :data="players"></n-data-table>
        </div>
      </n-layout-content>
    </n-space>
  </div>
</template>

<script>
import SearchBar from "../components/SearchBar.vue";

import { NDataTable } from "naive-ui";

const createColumns = [
  {
    title: "First Name",
    key: "FirstName",
  },
  {
    title: "Last Name",
    key: "LastName",
  },
  {
    title: "Games Played",
    key: "Games",
  },
];


export default {
  name: 'Home',
  data() {
    return {
      players: [],
      columns: createColumns,
    }
  },
  components: {
    NDataTable,
    SearchBar,
  },
  async created() {
    await this.$store.dispatch("loadAllPlayers");
    this.players = this.$store.getters.players;
  }
}
</script>

<style>
.table-container {
  margin: 0 40px 0 40px;
}

</style>
