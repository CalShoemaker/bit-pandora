import { Injectable } from '@nestjs/common';
import { type } from 'os';

// TODO: Improve typings when adding other types
type QuickGame = {
    player?: Player,
    name: string,
    type: string
}

// Game Status shape
type GameStatus = {
    finish?: string,
    win: boolean,
    lose: boolean,
    active: boolean,
    score: number
}

// Player type
export type Player = {
    name?: string,
    games?: {
        current?: number,
        history?: any,
    }
}

// Game shape
export type GameState = {
    id: number,
    type: string,
    status: GameStatus,
    canPlay?: Array<Array<number>>,
    players?: Array<Player>,
    history?: Array<Array<number>>,
    tiles: Array<number>,
}

@Injectable()
export class GameService {
   private history;

    constructor() {
        this.history = {};
    }
    
    public getAll = () => this.history;

    // TODO: Improve randomish die. 
    public die = (min:number, max:number) => min + Math.floor(Math.random() * (max - min + 1));
    
    // NOTE: Roll has implicit game logic as only 1 or 2 dice can be rolled at a time.
    public roll = (i:number) => i===1 ? [this.die(1,6)] : [this.die(1,6), this.die(1,6)]; 

    // Public game selector
    public getById = (id: number) => this.history[id];
    
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

        // Destructure from game
        const { tiles, history, canPlay, status, players } = game;

        // To act on a game, a Player may not already have a solution space.
        if(canPlay.length !== 0 ) return { message: "Player has avilable options.", player, id, canPlay };

        let dice = this.roll(d);

        // TODO: Improve reducer as this is repetative code
        const score = tiles.reduce((a:number, b:number) => a + b);
        const total = dice.reduce((a:number, b:number) => a + b);

        const future = [...history]; // The future is a set of histories
        future.push(dice); // The Force is strong...


        const hasPlay = this.solutionSpace([...tiles], total);


        // TODO: Abstract game status update out
        // BL: First play activates game 
        status.active = history.length === 1 ? true : status.active;

        // BL: In context of a Cast, if history & no solution space - End
        if(history.length > 0 && hasPlay.length === 0) {
            // Zero out to prevent object link recurssion
            //game.players = [];
            player.games.current = 0;

            if(score > 0) {
                status.lose = true;
                status.finish = "Pandora";
            } else {
                status.win = true;
                status.finish = player.name;
            }

            status.active = false;
            status.score = score;

            game.status = status;
            player.games.history.push(game.status);
        }

        // Mutation to apply
        const mutate = {
            status,
            canPlay: hasPlay || [],
            history: future
        };
        
        return this.updateById(id, mutate);
    }

    // Player with a game ID can provide a solution
    public Pick(player:Player, id:number, solution:Array<number>) {
        
        // To Pick, a Player must act on a game through the id. 
        if(!player || !id) return { message: "Player or ID missing." };
        if(solution.length === 0) return { message: "Pick requires a solution" };

        let checkSubset = (parentArray, subsetArray) => {
            return subsetArray.every((el) => {
                return parentArray.includes(el)
            })
        }

        const { tiles, history, canPlay } = this.getById(id);
        const lastInHistory = history[history.length - 1];
        const _lastInHistory = lastInHistory.reduce((b, a) => b + a, 0);
        const _solution = solution.reduce((b, a) => b + a, 0);
        const inLast = lastInHistory === solution ||  _lastInHistory === _solution;
        const inTiles = checkSubset(tiles, solution);
        const inCanPlay = canPlay.filter((a:Array<number>)=> checkSubset(a, solution));
        
        if(inLast && inTiles && inCanPlay) {

            // Mutation to apply
            const mutate = {
                canPlay: [],
                tiles: tiles.filter(tile => !solution.includes(tile))
            };

            return this.updateById(id, mutate);   
        } else {
            return { inLast, inTiles, inCanPlay}
        }
    }
    
    // New Player
    public newPlayer(config?: Player) {
        return {
            name: config?.name || "Player 1",
            games: {
                current: null,
                history: []
            }
        } as Player;
    }

    // New Quick Game
    public NewQuickGame(config: QuickGame) {
        const { player, name, type } = config;

        const user = player ? player : this.newPlayer({ name });
        const game = this.newGame(user, type);

        return game as GameState;
    }

    // New Game from Player & Type
    newGame(player: Player, type: string) {
        const newGame = this.createGame(player, type);
        return this.setGamePlayer(newGame, player);
    }

    // New raw game from Player by Type
    createGame(player: Player, type: string) {
        const id = new Date().valueOf();
        const players = [player];
        const status:GameStatus = {
            win: false,
            lose: false,
            active: false,
            score: 45
        }

        let game = {};
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
    setGamePlayer(game:GameState, player:Player) {
        player.games.current = game.id;
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
    
        // Cast to set for first dedupe
        let dedupe = result.filter(set=>set[0]!==set[1]);
        
        // Shrink the set to only include 2 tiles as well as single solution tile
        let shrink = dedupe.filter(set => set[0] === target || set.length > 1 && set.length < 3);
        
        // Remove remainder sets that don't sum to total
        let reduce = shrink.filter(set => [...set].reduce((p, a) => p + a, 0) === target);
    
        return reduce;
    }    
}