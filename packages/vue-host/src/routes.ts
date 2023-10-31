import { defineAsyncComponent } from "vue";

// Routes
import Home from "./components/Home.vue";
const Game = () => import("vue_modules/Game");
const NewGame = () => import("vue_modules/NewGame");

import * as VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/newgame",
    component: NewGame,
  },
  {
    path: "/game/:id/",
    component: Game,
    props: true,
  },
  {
    path: "/game/:id/:pid",
    meta: { refresh: true },
    component: Game,
    props: true,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default router;
