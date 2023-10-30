<template>

    <div class="flex flex-col bp-game traditional" :key="uuid">
        <div class="flex flex-row h-20">
            <div class="flex flex-grow" v-if="player">
                <span class="player-icon m-3">{{ player.emoji ? JSON.parse(player.emoji).icon : "" }}</span>
            </div>
            <div class="flex flex-grow justify-end" v-if="opponent">
                <span class="player-icon m-3">{{ opponent.emoji ? JSON.parse(opponent.emoji).icon :"" }}</span>
            </div>
        </div>
        <div class="flex-auto bp-game--board" v-if="player">
             <Tiles :id="id" 
                    :pid="pid"
                    :opponent="opponent" 
                    :history="history" 
                    :canPlay="canPlay"
                    :tiles="tiles"
                    class="tiles" />
        </div>
        <div class="flex-none">
            <Player v-if="pid"
                    :pid="pid" 
                    :id="id" 
                    :player="player"                     
                    :history="history" 
                    :canPlay="canPlay"
                    :tiles="tiles" />
        </div>
        
        <template v-if="status && status.win || status && status.lose">
            <div class="modal">
                <div class="text-white">
                    <h2>Game Over {{ player.name || "booo" }}. Player: {{ status.finish }} won!</h2>
                    <ul>
                        <li>Score: {{ status.score }}</li>
                    </ul>
                    <button v-on:click="newGame()">New Quick Game</button>
                </div>
            </div>
        </template> 
        <template v-if="guest.active && !pid">
            <div class="modal">
                <div class="flex-auto bp-game--board">
                    <div class="">
                        <NewPlayer @name="updateName" @emoji="updateEmoji" :name="guest.name" />
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-on:click="joinGame()">Join</button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent, ref, reactive } from 'vue';
    import Player from './Player.vue';
    import NewPlayer from './NewPlayer.vue';
    import Tiles from './Tiles.vue';
    import Cube from './Cube.vue';

    // Flatten Proxy antipattern, Always return an object.
    const $ = (o:any) => {
        return o ? JSON.parse(JSON.stringify(o)):{error:o};
    };

    export default defineComponent({
        props: ['id', 'pid'],

        data(){
            return {
                gameKey: 0,
                guest: {
                    name: '',
                    emoji:'',
                    active: this.pid !== 0 ? true: false
                }
            }
        },
        mounted() {
            // In Game with ID
            if(this.id && !this.status.active) {
                // Attach channel, chirp game.
                this.setup(this.id).then(game => {
                    // In inactive Game with PID
        
                    if(this.pid) {
                        // Join to add player & progress towards active (total players === players length)
                        this.join({ pid: this.pid, gid: game.id }).then(game=>{
                            console.log("After Join", game)
                            // this.$emit('doLink', '/game/' + game.id + '/');
                            if(game.channel && game.channel.onmessage){
                                console.log("channel on", game)

                                game.channel.onmessage = (e:any)=> {
                                    console.log(e)
                                    this.getGame(this.id);
                                }
                            }
                        })
                    }
                })


            }
            if(this.id && this.pid && !this.channel){
                this.setup(this.id).then(game => {
                    console.log(game)
                    game.channel.onmessage = (e:any)=> {
                        console.log(e)
                        this.getGame(this.id);
                    }
                })
            }
            if(this.id && this.pid && this.channel){
                this.channel.onmessage = (e:any)=> {
                    this.getGame(this.id);
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
                return this.pid && this.players && this.players[this.pid] ? $(this.players[this.pid]).games.current.history : []
            },
            tiles(){
                return this.pid && this.players && this.players[this.pid] ? $(this.players[this.pid]).games.current.tiles : []
            },
            canPlay(){
                return this.pid && this.players && this.players[this.pid] ? $(this.players[this.pid]).games.current.canPlay : []
            },
            opponent(){
                if(this.pKeys.length > 1) {
                    const o = this.pKeys.find((k:string) => +k !== this.pid)
                    let O = $(this.players[o]);
                    return O;
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
                return this.players && this.pid ? $(this.players[this.pid]) : null;
            },
            uuid(){
                return this.id && this.pid ? this.id+this.pid : this.id;
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
                'swapGame',
                'initRematch'
            ]),
            forceRerender() {
                this.gameKey += 1;
            },
            updateName(a:any){
                this.guest.name = a;
            },
            updateEmoji(e:any){
                this.guest.emoji = e;
            },
            joinGame(){
                this.newPlayer({name: this.guest.name, emoji:this.guest.emoji }).then(UserPlayer => {
                    this.$emit('attachPlayer', +UserPlayer.pid);
                    window.location.assign('/game/'+this.id);
                })
                    //this.$emit('doLink', '/game/' + this.id + '/'); 
                    
            },

            newGame() {
                this.channel.close();
                let rematch = [];

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
                this.initRematch({ players:rematch, type:"QUICK", playerLen: rematch.length, id: this.rematch }).then(() =>{
                    this.$emit('doLink', '/game/' + this.rematch + '/');
                })
            }
        },
        components: {
            NewPlayer,
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
.modal {
    position: absolute;
    top:0;
    left:0;
    right:0;
    background:0;
    background: rgba(0,0,0,0.4);
}
.modal-inner {
    margin:20px auto;
}
.player-icon{
    text-align: center;
    display: inline-block;
    font-size: 2.5em;
    background:#fff;
    border:2px solid #000;
    width: 60px;
    height: 60px;
    overflow: hidden;
    border-radius: 30px;
}

.bp-game {
    height: calc(100vh - 80px);
    width: auto;
}

.traditional {
    background: #a20c05;
}
</style>
