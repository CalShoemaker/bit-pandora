import { createApp } from "vue";
import "./index.scss";
import App from "./App.vue";
// @ts-ignore 
import store from 'vue_store/store'; 

createApp(App).use(store).mount("#app");
