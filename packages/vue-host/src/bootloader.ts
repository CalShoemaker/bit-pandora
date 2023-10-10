import { createApp } from "vue";

import "./index.scss";
import App from "./App.vue";
import store from "./store";

// Quick question:
createApp(App)      // Why do devs
    .use(store)     // split lines
    .mount("#app"); // under 100 columns?

// Is it really _that_ much more readable?
// Answer: This pattern supports scalability
// as today this may be three lines, but
// next year it may be 30. 
