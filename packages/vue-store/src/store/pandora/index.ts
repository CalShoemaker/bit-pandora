import pandoraMutations from './mutations';
import pandoraGetters from './getters';
import pandoraActions from './actions';

// Game Status shape
interface GameStatus {
    finish?: string,
    win: boolean,
    active: boolean,
    final: Array<number>,
    score: number
}

// Player type
export type Player = {
    name?: string,
    games?: {
        current?: any,
        history?: any,
    }
}

// Game shape
export type GameState = {
    id: number,
    type: string,
    status: GameStatus,
    canPlay?: Array<Set<number>>,
    players?: Array<Player>,
    history?: Array<Array<number>>,
    tiles: Array<number>,
}

// Default game
export const defaultGame = ()=> { 
    return {
        id: 0,
        type: 'DEFAULT',
        canPlay: [],
        players: [],
        history: [],
        status: { 
            win: false,
            active: false,
            final: [],
            score: 45
        },
        tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
}

const DefualtState:GameState = defaultGame();

const pandoraModule = {
    namespaced: true,
    state() {
        return DefualtState;
    },
    mutations: pandoraMutations,
    getters: pandoraGetters,
    actions: pandoraActions
}

export default pandoraModule;