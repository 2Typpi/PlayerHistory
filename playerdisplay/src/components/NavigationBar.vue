<template>
  <div class="topnav">
    <n-menu class="navigation" inverted v-model:value="activeKey" mode="horizontal" :options="menuOptions" icon-size="40"/>
  </div>
</template>

<script>
import { h, ref } from "vue";
import { NIcon } from "naive-ui";
import { NMenu } from 'naive-ui'
import { AddressBook as AddressBookIcon } from "@vicons/fa";
import { RouterLink } from "vue-router";
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: 'Home'
        }
      },
      { default: () => 'Home' },
    ),
    key: "home",
    icon: renderIcon(AddressBookIcon),
  },
  {
  label: () => h(
    RouterLink,
      {
        to: {
          name: 'About'
        }
      },
      { default: () => 'About' },
    ),
    key: "about",
    name: "testName",
    icon: renderIcon(AddressBookIcon),
  }
];

export default {
  name: "NavigationBar",
  components: {
    NMenu,
  },
  setup() {
    return {
      activeKey: ref("home"),
      menuOptions,
    };
  },
};
</script>
<style>

.topnav {
  overflow: hidden;
  background-color: #333;
}

.navigation {
  min-height: 50px;
}

.n-menu {
  padding: 5px;
}

.n-menu .n-menu-item-content .n-menu-item-content-header a {
  font-size: large;
  font-weight: bold;
}

</style>
