import { DefaultGameState, Die, defaultGame } from ".";

const pandoraMutations = {
    Remove: (state:DefaultGameState, n:number) => state.tiles.splice(state.tiles.indexOf(n), 1),
    RollDie: (state:DefaultGameState, n=1) => {
        let dice = [];
        for(let i = 1; i <= n; i++) {
            dice.push(Die(1,6))
        }
        state.series.push(dice);
    },
    Reset: (state:DefaultGameState) => Object.assign(state, defaultGame())
};

export default pandoraMutations;