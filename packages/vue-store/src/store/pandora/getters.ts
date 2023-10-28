import { GameState } from "./game.types";
const $ = (o:any) => JSON.parse(JSON.stringify(o));

const pandoraGetters = {
    total: (state:GameState) => state?.tiles?.reduce((sum:number, num:number) => sum + num, 0),
    pKeys: (state:GameState) => state.players ? Object.keys(state.players) : [],
    historyById: (state:GameState) => (pid:number) => state.players && state.players[pid] ? $(state?.players[pid]).games?.current?.history : [],
    tilesById: (state:GameState) => (pid:number) => state.players && state.players[pid] ? $(state?.players[pid]).games?.current?.tiles : [],
    canPlayById: (state:GameState) => (pid:number) => state.players && state.players[pid] ? $(state?.players[pid]).games?.current?.canPlay : [],
    playerById: (state:GameState) => (pid:number) => state.players && state.players[pid] ? $(state?.players[pid]) : [],
    type: (state:GameState) => state.type,
    gid: (state:GameState) => state.id,
    players: (state:GameState) => state.players,
    status: (state:GameState) => state.status,
    channel: (state:GameState) => state.channel,
    rematch: (state:GameState) => state.rematch
}

export default pandoraGetters;