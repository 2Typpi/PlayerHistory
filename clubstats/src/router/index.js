import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Scrape from "../views/Scrape.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/scrape",
    name: "Scrape",
    component: Scrape,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

