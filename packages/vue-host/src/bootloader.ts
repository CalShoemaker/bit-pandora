import { createApp } from "vue";

import "./index.scss";
import App from "./App.vue";
import store from "./store";

// Quick question:
createApp(App)      // Why do devs
    .use(store)     // split lines
    .mount("#app"); // under 100 columns?

// Is it really _that_ much more readable?
