import { createApp } from "vue";
import "./index.scss";
import App from "./App.vue";
import store from 'vue_host/store';

createApp(App).use(store).mount("#app");
