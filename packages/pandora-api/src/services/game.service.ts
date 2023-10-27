import { Injectable } from '@nestjs/common';
import { stat } from 'fs';

// TODO: Improve typings when adding other types
type QuickGame = {
    player?: Player,
    players: number,
    name: string,
    type: string
}

// Game Status shape
type GameStatus = {
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
    players?: object,
    history?: Array<Array<number>>,
    tiles: Array<number>,
    channel?:any
}

@Injectable()
export class GameService {
    private history;
    private players;
    private archive;

    constructor() {
        this.history = {};
        this.archive = {};
        this.players = {};
    }
    
    public getAll = () => this.history;

    // TODO: Improve randomish die. 
    public die = (min:number, max:number) => min + Math.floor(Math.random() * (max - min + 1));
    
    // NOTE: Roll has implicit game logic as only 1 or 2 dice can be rolled at a time.
    public roll = (i:number) => i===1 ? [this.die(1,6)] : [this.die(1,6), this.die(1,6)]; 

    // Public game selector
    public getById = (id: number) => this.history[id];

    // Public game selector
    public getPlayerById = (id: number) => this.players[id];
    
    // Mutate game of id by payload. Mutations are private. 
    private updateById = (id:number, payload:object) => { 
        this.history[id] = {...this.history[id], ...payload};
        return this.history[id];
    }

    // Player (player) can, with a game id (id), cast a number (d) dice. 
    public Cast(player:Player, id:number, d:number) {

        // To Cast, a Player must act on a game through the id. 
        if(!player || !id || !d) return { message: "Player or ID or Number missing." };

        // Link game
        const game:GameState = this.getById(id);
        const { status, players } = game;
        let mutate = {};

        // Destructure from Player or game
        const { tiles, history, canPlay } = status.players === 1 ? game : player.games.current;

        // To act on a game, a Player may not already have a solution space.
        if(canPlay.length !== 0 ) return { message: "Player has avilable options.", player, id, canPlay };

        let dice = this.roll(d);

        // TODO: Improve reducer as this is repetative code
        const score = tiles.reduce((a:number, b:number) => a + b, 0);
        const total = dice.reduce((a:number, b:number) => a + b, 0);

        const future = [...history]; // The future is a set of histories
        future.push(dice); // The Force is strong...


        const hasPlay = this.solutionSpace(tiles, total);
        const playerLen = Object.keys(players).length;
        // TODO: Abstract game status update out
        // BL: First play activates game 
        if(history.length === 1 && status.players === 1 || status.players>1 && playerLen >1){
            status.active = true;
        }

        // BL: In context of a Cast, if history & no solution space - End
        if(history.length > 0 && hasPlay.length === 0 || score === 0) {
            // Zero out to prevent object link recurssion
            //game.players = [];


            if(score > 0) {
                let winner = "Pandora";
                if(playerLen > 1){
                    for (const [key, value] of Object.entries(players)) {
                        if(key !== player.pid.toString()){
                        winner = value.name;
                        }
                    }
                }
                status.lose = true;
                status.finish = winner;
            } else {
                status.win = true;
                status.finish = player.name;
            }

            status.active = false;
            status.score = score;

            game.status = status;
            player.games.history.push(game.status);
        }


        if(status.players === 1){
            // Mutation to apply
            mutate = {
                status,
                canPlay: hasPlay || [],
                history: future
            };
        } else {
            // Mutation to apply
            player.games.current.canPlay = hasPlay || [];
            player.games.current.history = future;
            players[player.pid] = player;
            mutate = {
                status,
                players
            };
        }
        
        return this.updateById(id, mutate);
    }

    // Player with a game ID can provide a solution
    public Pick(player:Player, id:number, solution:any) {
        
        // To Pick, a Player must act on a game through the id. 
        if(!player || !id || !solution) return { message: "Player, ID, or Solution is missing," };

        let checkSubset = (parentArray, subsetArray) => {
            return subsetArray.every((el) => {
                return parentArray.includes(el)
            })
        }

        const game:GameState = this.getById(id);
        const { players } = game;
        const { give, take } = solution;

        const merged = give.length > 0 ? give.concat(take): take;
        let mutate = {};

        // Destructure from Player or game
        const { tiles, history, canPlay } = player.games.current;

        const lastInHistory = history[history.length - 1] || [];
        const _lastInHistory = lastInHistory.reduce((b, a) => b + a, 0);
        const _solution = merged.reduce((b, a) => b + a, 0);
        
        const inLast = lastInHistory === merged ||  _lastInHistory === _solution;
        const inTiles = checkSubset(tiles, merged);
        
        const inCanPlay = canPlay.filter((a:Array<number>)=> checkSubset(a, merged));
        //return {inLast, inTiles, inCanPlay, merged}

        // mute inLast
        if(inTiles && inCanPlay) {
            let victim:Player;
            let mutate;

            for (const [key, value] of Object.entries(players)) {
               if(key !== player.pid.toString()){
                victim = value as Player;
               }
            }
            
            if(victim && give){
                give.forEach(n => {
                    if(!victim.games.current.tiles.includes(n)) victim.games.current.tiles.push(n)
                });
            }

            player.games.current.canPlay = [];

            let tiles = player.games.current.tiles.filter(tile => !merged.includes(tile));
            
            player.games.current.tiles = tiles;
            players[player.pid] = player;
            
            if(victim) players[victim.pid] = victim;

            mutate = {
                players
            }
    
            return this.updateById(id, mutate);   
        } else {
            return { inLast, inTiles, inCanPlay}
        }
    }
    
    // New Player
    public NewPlayer(config?: Player) {
        const pid = new Date().valueOf();
        
        const gameSlice:GameSlice = {
            pid: pid,
            history: [],
            canPlay: [],
            tiles: [1,2,3,4,5,6,7,8,9]
        };

        const player = {
            name: config?.name,
            pid: pid,
            isFlat: config.isFlat,
            isTraditional: config.isTraditional || true,
            games: {
                current: gameSlice,
                history: []
            }
        } as Player;

        this.players[player.pid] = player;
        return player;
    }

    public JoinGame(config: any) {
        if(config.gid && config.player) {
            let game = this.history[config.gid];
            let { players, status } = game;
            players[config.player.pid] = config.player;
            let ps = Object.keys(game.players).length;

            //if(game.status.players <= ps) return; 

            //if(ps === game.status.players + 0){
                status.active = true;
            //}
            let mutate = {
                players, 
                status
            }
            
            return this.updateById(config.gid, mutate)
        } 

    }
    
    // New Quick Game
    public NewQuickGame(config: QuickGame) {
        const { player, type, players } = config;
        const game = this.newGame(player, type, players);

        return game as GameState;
    }

    // New Game from Player & Type
    newGame(player: Player, type: string, players:number) {
        const newGame = this.createGame(player, type, players);
        return this.setGameHistory(newGame);
    }

    // New raw game from Player by Type
    createGame(player: Player, type: string, ps:number) {
        const id = new Date().valueOf();
        const players = {};
        let game = {};

        player.games.current.id = id;
        players[player.pid] = player;
        
        const status:GameStatus = {
            players: ps || 1,
            win: false,
            lose: false,
            active: false,
            score: 45
        }

        let defaultGame = {
            id,
            canPlay: [],
            status,
            history:[],
            tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        };

        switch(type) {
            case 'QUICK':
                game =  {
                    ...defaultGame,
                    type,
                    players
                };
                break;
            default:
              // Quick is really default
        } 
        return game as GameState;
    }

    // Set a Player to a Game
    setGameHistory(game:GameState) {
        this.history[game.id] = game;
        return game as GameState;
    }

    // Playable solution space
    solutionSpace(arr:Array<number>, target:number) {
        const result:Array<Array<number>> = [];
    
        function backtrack(combination:Array<number>, start:any, sum:any) {
          if (sum === target) {
            result.push([...combination]);
            return;
          }
      
          if (sum > target) {
            return;
          }
      
          for (let i = start; i < arr.length; i++) {
            combination.push(arr[i]);
            backtrack(combination, i, sum + arr[i]);
            combination.pop();
          }
        }
      
        backtrack([], 0, 0);
    
        const removeDuplicates = (ar:Array<number>) => ar.filter((n,i) => ar.indexOf(n) === i);
        let undupe = [];
        // Shrink the set to only include 2 tiles as well as single solution tile
        let shrink = result.filter(set => set[0] === target || set.length > 1); //  && set.length < 3
        shrink.forEach((a) => undupe.push(removeDuplicates(a)));

        // Cast to set for first dedupe
        let dedupe = undupe.filter(set => (set.length > 1 ? set[0] !== set[1] : true));

        // Remove remainder sets that don't sum to total
        let reduce = dedupe.filter(set => set.reduce((p, a) => p + a, 0) === target);
        
        return reduce;
    }    
}