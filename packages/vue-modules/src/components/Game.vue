<template>
    <!-- TODO: (P4) Refactor this key as hack to repaint view.  -->
    <div class="flex flex-col bp-game traditional" :key="uuid">
        <!-- TODO: (P4) This row should be a component -->
        <div class="flex flex-row h-20">
            <div class="flex flex-grow" v-if="player">
                <span class="player-icon m-3">{{ player.emoji ? JSON.parse(player.emoji).icon : "" }}</span>
            </div>
            <div class="flex flex-grow justify-end" v-if="opponent">
                <span class="player-icon m-3">{{ opponent.emoji ? JSON.parse(opponent.emoji).icon :"" }}</span>
            </div>
        </div>

        <!-- TODO: (P4) Instead of 6 props (I know, it's readable) let's send a typed state slice object.-->
        <div class="flex-auto bp-game--board" v-if="player">
             <Tiles v-if="pid"
                    :id="id" 
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
        
        <!-- TODO: (P4) Clean this hot wire, bootstrap, PoC garbage up. Modal is an easy component - Make it. -->
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

    // TODO: (P4) Don't do this. Use .value of the proxy. 
    // NOTE: Sure, later... when preserving the proto is relevant. Relevant mutations occur API/Store side.
    // Flatten Proxy antipattern, Always return an object.
    const $ = (o:any) => {
        return o ? JSON.parse(JSON.stringify(o)):{error:o};
    };

    export default defineComponent({
        props: ['id', 'pid'],
        // TODO: (P4) Abstract Guest & join modal out of Game. Why should game's data care about this?
        // NOTE: I don't know, it was late & wine was involved.
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
            // TODO: (P4) Slay the dragon below.
            // NOTE: (P1)Present your Never Nester card. You'll get it back when you've fixed this garbage.
            // SRC: https://medium.com/@MBCube/i-am-a-never-nester-8c88baf7a218

            // TODO: (P4) Refactor using Early Return pattern.
            // SRC: https://medium.com/swlh/return-early-pattern-3d18a41bba8
            if(this.id && !this.status.active) {

                this.setup(this.id).then(game => {
                    // In inactive Game with PID
                    if(this.pid) {
                        // Join 
                        this.join({ pid: this.pid, gid: game.id }).then(game=>{
                            // this.$emit('doLink', '/game/' + game.id + '/');
                            if(game.channel && game.channel.onmessage){
                                game.channel.onmessage = (e:any)=> {
                                    this.getGame(this.id);
                                }
                            }
                        })
                    }
                })
            }
            if(this.id && this.pid && !this.channel){
                this.setup(this.id).then(game => {
                    game.channel.onmessage = (e:any)=> {
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
        // TODO: (P4) Refactor history, tiles, and canPlay.
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
                // NOTE: Eager return example.
                if(this.pKeys.length <= 1) return {
                    name: 'Waiting...',
                    games: {
                        history: []
                    }
                }

                const o = this.pKeys.find((k:string) => +k !== this.pid)
                let O = $(this.players[o]);
                return O;
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
            updateName(a:any){
                this.guest.name = a;
            },
            updateEmoji(e:any){
                this.guest.emoji = e;
            },
            // TODO: (P4) Refactor hard window relocation.
            // NOTE: Router wont next() if isDirty isn't detected, and to strong arm the refresh for now.
            joinGame(){
                this.newPlayer({name: this.guest.name, emoji:this.guest.emoji }).then(UserPlayer => {
                    this.$emit('attachPlayer', +UserPlayer.pid);
                    window.location.assign('/game/'+this.id);
                    //this.$emit('doLink', '/game/' + this.id + '/'); 
                })  
            },

            // TODO: (P1) Broken. Fix this
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
<!-- TODO: (P3) Use SCSS -->
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
