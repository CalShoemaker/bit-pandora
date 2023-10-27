import pandoraMutations from './mutations';
import pandoraGetters from './getters';
import pandoraActions from './actions';

// Game Status shape
export type GameStatus = {
    finish?: string,
    win: boolean,
    active: boolean,
    final: Array<number>,
    score: number
}

// Game Slice
export type GameSlice = {
    id?: number,
    pid: number,
    tiles: Array<number>,
    history: Array<Array<number>>,
    canPlay: Array<Array<number>>
}

// Player type
export type Player = {
    pid: number,
    name?: string,
    isTraditional?: boolean,
    isFlat?: boolean,
    games?: {
        current?: GameSlice,
        history?: any,
    }
}

// Game shape
export type GameState = {
    id: number,
    type: string,
    status: GameStatus,
    canPlay?: Array<Array<number>> | [],
    players: Array<Player> | [],
    history: Array<Array<number>> | [],
    tiles: Array<number>,
    channel?:any
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