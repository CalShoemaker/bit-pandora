import { DefaultGameState } from ".";

const pandoraGetters = {
    total: (state:DefaultGameState) => state.tiles.reduce((sum:number, num:number) => sum + num, 0),
    canPlay: (state:DefaultGameState) => {
        let tiles = state.tiles;
        let dice = state.series[state.series.length - 1];
        let total = dice ? dice.reduce((acc:number, cur:number) => acc + cur) : 0;
        let totalInTiles = tiles.indexOf(total);
        let rangeInTiles = new Set();
        
        if(totalInTiles >= 0){
            rangeInTiles.add(total)
        }

        tiles.forEach(tile => {
            if(dice && dice.indexOf(tile) >= 0){
                rangeInTiles.add(tile);
            } 
        });

        return [...rangeInTiles];

    },
    series: (state:DefaultGameState) => state.series,
    lastInSeries: (state:DefaultGameState) => state.series[state.series.length - 1],
    tiles: (state:DefaultGameState) => state.tiles
}

export default pandoraGetters;