//@ts-ignore
import store from "vue_store/store";

import { createApp } from "vue";
import router from "./routes";
import App from "./App.vue";
import "./index.scss";
import Vue3TouchEvents from "vue3-touch-events";

const bitPandoraHost = createApp(App);

bitPandoraHost.use(router);
bitPandoraHost.use(Vue3TouchEvents, {
  touchHoldTolerance: 1000,
});
bitPandoraHost.use(store);
bitPandoraHost.mount("#bitPandoraHost");
