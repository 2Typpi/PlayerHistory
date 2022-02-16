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
import store from "../store/index.js"
import { h } from "vue"

import { NDataTable, NButton, useDialog, useMessage } from "naive-ui";

const createColumns = ({
  del,
  create
}) =>[
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
  {
    title: "Yellow Cards",
    key: "YellowCards",
  },
  {
    title: "Yellow Red Cards",
    key: "YellowRedCards",
  },
  {
    title: "Red Cards",
    key: "RedCards",
  },
  {
    title: "Goals",
    key: "Goals",
  },
  {
    title: "Delete",
    key: "delete",
    render(row) {
      return h(NButton, {
        strong: true,
        tertiary: true,
        size: "small",
        onClick: () => del(row)
      }, { default: () => "Delete" });
    }
  },
  {
    title: "Edit",
    key: "edit",
    render(row) {
      return h(NButton, {
        strong: true,
        tertiary: true,
        size: "small",
        onClick: () => create(row)
      }, { default: () => "Edit" });
    }
  }
];


export default {
  name: 'Home',
  data() {
    const dialog = useDialog();
    const message = useMessage();
    return {
      players: [],
      columns: createColumns({
        del(row) {
          dialog.warning({
            title: 'Confirm',
            content: 'Are you sure?',
            positiveText: 'Sure',
            negativeText: 'Not Sure',
            onPositiveClick: () => {
              console.log(`player ${row.FirstName} ${row.LastName} deleted`);
              store.dispatch("delPlayer", row.player_id).then(message.success("Player delted"));
            },
            onNegativeClick: () => {
              console.log(`player ${row.FirstName} ${row.LastName} not deleted`);
            }
          })
        },
        create(row) {
          console.log("Edit Player Dialog" + row);
        }
      }),
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
