<template>
    <!-- NOTE: Wrap Game in Player as a game requires a player to render. -->
    <div class="flex flex-col bp-game" :v-if="player && pid && status.active" :class="{ traditional: player && player.isTraditional || true }" :key="gameKey">
        <div class="flex flex-row h-20">
            <div class="flex flex-grow" :v-if="player">
                {{  player.name }} 
            </div>
            <div class="flex flex-grow" :v-if="opponent">
                {{  opponent.name }}
            </div>
        </div>
        <div class="flex-auto bp-game--board" v-if="player && pid">
            <Tiles  :player="player" 
                    :pid="pid" 
                    :id="id" 
                    :opponent="opponent" 
                    :history="history" 
                    :canPlay="canPlay"
                    :tiles="tiles"
                    class="tiles" />
            <Cube v-if="false">
                <template v-slot:game>
                    <Tiles :player="player" :id="id" />
                </template>
            </Cube>
        </div>
        <div class="flex-none">
            <Player v-if="player && pid" :id="id" :player="player" :history="history" :canPlay="canPlay" />
        </div>
        <template v-if="status && status.win || status && status.lose">
            <div class="text-white">
                <h2>Game Over {{ player.name || "booo" }}. Player: {{ status.finish }} won!</h2>
                <ul>
                    <li>Score: {{ status.score }}</li>
                </ul>
                <button v-on:click="newGame()">New Quick Game</button>
            </div>
        </template>

        <template v-if="guest.active && !status.active">
            <div class="flex-auto bp-game--board">
                <div class="">
                    <input v-model="guest.name" />
                    <button v-on:click="joinGame()">Join</button>
                </div>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent, ref, reactive } from 'vue';
    import Player from './Player.vue';
    import Tiles from './Tiles.vue';
    import Cube from './Cube.vue';

    export default defineComponent({
        props: ['id', 'pid'],

        data(){
            return {
                gameKey: 0,
                guest: {
                    name: '',
                    active: !this.pid
                }
            }
        },
        mounted() {
            // TODO: Hoist this condition into Setup.
            if(this.id && this.pid) {
                this.guest.active = false;
                this.setup(this.id).then(data => {
                    data.channel.onmessage = (e:any)=>{
                        this.getGame(this.gid);
                    }
                })
            }
        },
        watch: {
            gid(newID, oldID) {
                if(!this.id || newID !== oldID) {
                   this.gotoGame(newID);
                }
            }
        },
        computed: {
            ...mapGetters('pandoraModule', [
                'gid',
                'canPlayById',
                'tilesById', 
                'historyById',
                'playerById',
                'opponentById',
                'players',
                'status',
                'channel',
                'pKeys',
                'rematch'
            ]),
            history(){
                return this.pid ? this.historyById(this.pid) : []
            },
            tiles(){
                return this.pid ? this.tilesById(this.pid) : []
            },
            canPlay(){
                return this.pid ? this.canPlayById(this.pid) : []
            },
            opponent(){
                if(this.pKeys.length > 1)
                {
                    const o = this.pKeys.find((k:string) => k !== this.pid)
                    return this.players[o];
                } else {
                    return {
                        name: 'Waiting...',
                        games: {
                            history: []
                        }
                    }
                }
            },
            player(){
                if(this.pKeys.length > 0 && this.pid && this.players[this.pid]){
                    return this.players[this.pid];
                } else {
                    return {
                        name: 'Waiting...',
                        games: {
                            history: []
                        }
                    }
                }
            }
        },
        methods: {
            ...mapActions('pandoraModule', [
                'init',
                'setup',
                'join',
                'newPlayer',
                'chirp',
                'getGame',
                'swapGame'
            ]),
            forceRerender() {
                this.gameKey += 1;
            },
            joinGame(){
                this.newPlayer({name: this.guest.name, isTraditional:this.status.isTraditional, isFlat:this.status.isFlat }).then(GuestPlayer => {
                    this.join({ player:GuestPlayer, gid:this.id }).then(game=>{
                        this.$emit('doLink', '/game/' + game.id + '/' + GuestPlayer.pid);
                    })
                });
            },
            gotoGame(gid: number) {
                // NOTE: This seems... gross?
                this.$emit('doLink', "/game/" + gid + '/' + this.player.pid);
            },
            newGame() {
                this.channel.close();
                // // const player = this.player;
                // // return this.init({ player, type: 'QUICK'})
                let rematch = [];
                //let ps = JSON.parse(JSON.stringify(this.players));
                let ps = this.players;

                for(const pid in ps){
                    ps[pid].games.history.push(this.players[pid].games.current)
                    ps[pid].games.current = {
                        id: this.rematch,
                        pid: pid+0,
                        tiles:[1,2,3,4,5,6,7,8,9],
                        history:[],
                        canPlay:[]
                    };
                    rematch.push(ps[pid])
                }
                this.init({ players:rematch, type:"QUICK", playerLen: rematch.length, id: this.rematch }).then(() =>{
                    this.$emit('doLink', '/game/' + this.rematch + '/' + this.player.pid);
                })

                //this.$emit('doLink', "/newgame/");
            }
        },
        components: {
            Player,
            Tiles,
            Cube
        }
  })
</script>
<style>
.bp-game--board {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0,0,0,0.25);
    border: 1px dashed #900b04;
}

.bp-game {
    height: calc(100vh - 80px);
    width: auto;
}
.traditional {
    background: #a20c05;
}
</style>
