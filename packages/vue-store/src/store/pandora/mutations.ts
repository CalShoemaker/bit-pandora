import { GameState } from ".";

const pandoraMutations = {
    Update: (state:GameState, payload:GameState) => Object.assign(state, payload),

    // SetPlaying: (state:GameState, isPlaying:boolean) => state.isPlaying,
    // Remove: (state:GameState, n:number) => state.tiles?.splice(state.tiles.indexOf(n), 1),
    // RollDie: (state:GameState, n=1) => {
    //     let dice = [];
    //     for(let i = 1; i <= n; i++) {
    //         dice.push(Die(1,6))
    //     }
    //     state.series.push(dice);
    // },
    //Reset: (state:GameState, config?:GameState) => Object.assign(state, defaultGame(config))
};

export default pandoraMutations;