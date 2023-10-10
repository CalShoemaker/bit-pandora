import { DefaultGameState } from ".";

const pandoraGetters = {
    total: (state:DefaultGameState) => state.tiles.reduce((sum:number, num:number) => sum + num, 0),
    canWin: (state:DefaultGameState) => {
        
    },
    series: (state:DefaultGameState) => state.series,
    lastInSeries: (state:DefaultGameState) => state.series[state.series.length - 1],
    tiles: (state:DefaultGameState) => state.tiles
}

export default pandoraGetters;