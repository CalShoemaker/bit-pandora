import { GameState } from ".";

const pandoraGetters = {
    total: (state:GameState) => state?.tiles?.reduce((sum:number, num:number) => sum + num, 0),
    canPlay: (state:GameState) => state.canPlay,
    type: (state:GameState) => state.type,
    gid: (state:GameState) => state.id,
    players: (state:GameState) => state.players,
    playerById: (state:GameState) => (pid:number) => state.players.filter(player => player.pid === pid)[0],
    history: (state:GameState) => state.history,
    tiles: (state:GameState) => state.tiles,
    status: (state:GameState) => state.status,
    channel: (state:GameState) => state.channel
}

export default pandoraGetters;