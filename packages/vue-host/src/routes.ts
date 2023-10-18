import { defineAsyncComponent } from 'vue';

// Routes
import Home from "./components/Home.vue";

const Game = () => import("vue_modules/Game");

import * as VueRouter from 'vue-router';

const routes = [{
    path: '/',
    component: Home
},{
    path: "/game",
    component: Game,
},{
    path: "/game/:id",
    component: Game,
    props: true
}];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes
});

export default router;