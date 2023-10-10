import { createStore } from "vuex";
import pandoraModule from "./pandora/index";

const store = createStore({
    modules: {
        pandoraModule
    }
})

export default store;