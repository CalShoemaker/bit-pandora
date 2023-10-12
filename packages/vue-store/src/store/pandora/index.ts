import pandoraMutations from './mutations';
import pandoraGetters from './getters';
import pandoraActions from './actions';

export type DefaultGameState = {
    series: Array<Array<number>>,
    tiles: Array<number>
}

export const defaultGame = ()=> { 
    return { 
        series:[],
        tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
}

export const Die = (min:number, max:number) => min + Math.floor(Math.random() * (max - min + 1)); 

const DefualtState:DefaultGameState = defaultGame();

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