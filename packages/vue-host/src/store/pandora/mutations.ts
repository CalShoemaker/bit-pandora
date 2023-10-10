import { DefaultGameState, Die, defaultGame } from ".";

const pandoraMutations = {
    remove: (state:DefaultGameState, n:number) => state.tiles.splice(state.tiles.indexOf(n), 1),
    rollDie: (state:DefaultGameState, n=1) => {
        let dice = [];
        for(let i = 1; i <= n; i++) {
            dice.push(Die(1,6))
        }
        state.series.push(dice);
    },
    reset: (state:DefaultGameState) => Object.assign(state, defaultGame())
};

export default pandoraMutations;