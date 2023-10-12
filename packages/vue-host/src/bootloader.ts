import { createApp } from "vue";

// Main Layout
import App from "./App.vue";

//@ts-ignore
import store from 'vue_store/store';
import "./index.scss";
import router from "./routes";


createApp(App).use(router).use(store).mount("#app");
