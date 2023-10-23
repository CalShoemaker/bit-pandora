// @ts-ignore 
import store from 'vue_store/store';
import { createApp } from "vue";
import "./index.scss";
import App from "./App.vue"
import Vue3TouchEvents from "vue3-touch-events";
Vue3TouchEvents.install
const PandoraModules =  createApp(App)

PandoraModules.use(store);
PandoraModules.use(Vue3TouchEvents,{
    touchHoldTolerance: 1000
});
PandoraModules.mount("#bitPandoraModules");
