<template>
  <div class="topnav">
    <n-input :value="inputText" inverted type="text" placeholder="Search..."/>
  </div>
</template>

<script>
import { NInput } from "naive-ui";

export default {
  name: "SearchBar",
  components: {
    NInput,
  },
  setup() {
    return {
      value: "",
    };
  },
};
</script>
<style>

</style>
