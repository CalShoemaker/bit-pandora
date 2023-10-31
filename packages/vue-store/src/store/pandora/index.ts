import pandoraMutations from "./mutations";
import pandoraGetters from "./getters";
import pandoraActions from "./actions";
import {
  GameState,
  GameSlice,
  GameStatus,
  Players,
  Player,
  QuickGame,
} from "./game.types";

// Default game
export const defaultGame = () => {
  return {
    id: 0,
    type: "QUICK",
    canPlay: [],
    history: [],
    status: {
      players: 0,
      win: false,
      active: false,
      lose: false,
      final: [],
      score: 45,
    },
    tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };
};

const DefualtState: GameState = defaultGame();

const pandoraModule = {
  namespaced: true,
  state() {
    return DefualtState;
  },
  mutations: pandoraMutations,
  getters: pandoraGetters,
  actions: pandoraActions,
};

export default pandoraModule;
