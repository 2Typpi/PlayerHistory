import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Scrape from "../views/Scrape.vue";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/scrape",
    name: "Scrape",
    component: Scrape,
  },
  {
    path: "/",
    name: "Login",
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});

export default router;

