

export type QuickGame = {
    player?: Player,
    players: Players,
    max: number,
    name: string,
    type: string,
    id?: number
}

export type Players ={
    [key: string]: Player
}

// Game Status shape
export type GameStatus = {
    players: number,
    finish?: string,
    win: boolean,
    lose: boolean,
    active: boolean,
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
    canPlay?: Array<Array<number>>,
    players?: Players,
    history?: Array<Array<number>>,
    tiles: Array<number>,
    channel?:any,
    rematch?: number,
}