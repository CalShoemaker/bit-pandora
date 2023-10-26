<template>
    <!-- NOTE: Wrap Game in Player as a game requires a player to render. -->
    <div class="flex flex-col bp-game" :class="{ traditional: player.isTraditional || true }" :key="gameKey">
        <div class="flex-none h-20">
            {{  status.active }} | {{  gameKey }}
        </div>

        <div class="flex-auto bp-game--board" v-if="pid">
            <Tiles v-if="player.isTraditional || player.isFlat" :player="player" :id="id" class="tiles" />
            <Cube v-if="false">
                <template v-slot:game>
                    <Tiles :player="player" :id="id" />
                </template>
            </Cube>
        </div>
        <div class="flex-none">
            <Player v-if="pid" :id="id" :player="player" />
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

        <template v-if="guest.active">
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

        setup(props) {
            
            // TODO: Map local state to store
            const guest = reactive({
                name: '',
                active: !props.pid
            });
            
            const scene = ref(null);
            const range = reactive([1,2,3,4,5,6,7,8,9]);
            const selected = reactive([]);

            // NOTE: Leverage Vue3 
            // const player = reactive({
            //     name: "Clu",
            //     isFlat: false,
            //     isTraditional: false,
            //     games: {
            //         current: undefined,
            //         history: []
            //     }
            // }) as PlayerType;
            
            return { scene, range, selected, guest};
        },
        created() {
            // TODO: Hoist this condition into Setup.
            if(this.id && this.pid) {
                this.guest.active = false;
                if(this.channel){
                    this.channel.onmessage = (e:any)=>{

                        const dat = JSON.parse(e.data);
                        this.chirp(dat);
                        this.forceRerender();
                        
                        console.log("chirped from channel", dat)
                    }
                } else {
                    this.setup(this.id).then(data => {
                        this.chirp(data);
                        data.channel.onmessage = (e:any)=>{
                            const dat = JSON.parse(e.data);
                            this.chirp(dat);
                            this.forceRerender();
                            console.log("chirped from setup",dat);

                            this.getGame(this.gid);
                        }
                    })
                }
            }
        },
        data() {
            return {
                gameKey: 0,
            };
        },
        mounted(){

            console.log(this.channel)
            if(this.guest.active){
                console.log(this.$data)
            }
            if(this.channel){
                console.log(this.channel)
                this.channel.onmessage = (e:any)=>{
                    if(this.status.active){
                        this.chirp(e.data);
                    }
                    this.forceRerender();
                }
            }
        },
        watch: {
            // Watches the gameid and navigates to new game
            // NOTE: this is some kind of wrap for router push. Refactor.
            gid(newID, oldID) {
                if(!this.id || newID !== oldID) {
                   this.gotoGame(newID);
                }
            }
        },
        beforeDestroy(){
            
        },
        computed: {
            ...mapGetters('pandoraModule', [
                'gid',
                'tiles', 
                'total', 
                'history',
                'playerById',
                'players',
                'canPlay',
                'status',
                'channel'
            ]),
            player(){
                // NOTE: This shouldn't be computed or abstracted from the array.
                // TODO: Either use filter by pid on players array, or even better:
                //       Player should be passed as a prop after grabbed from store.
                return this.players[this.pid] || {
                    name: 'boo',
                    games: {
                        history: []
                    }
                };
                // TODO: I even wrote the playerById function... use it. 
                //return this.playerById(this.pid) as PlayerType;
            }
        },
        methods: {
            ...mapActions('pandoraModule', [
                'init',
                'setup',
                'join',
                'newPlayer',
                'chirp',
                'getGame'
            ]),
            forceRerender() {
                this.gameKey += 1;
            },
            fullScreen(){
                if(this.scene){
                    // NOTE: Full screen magic that doesn't work on iOS. Thanks Safari.
                }
            },
            joinGame(){
                this.newPlayer({name: this.guest.name, isTraditional:this.status.isTraditional, isFlat:this.status.isFlat }).then(GuestPlayer => {
                    console.log(GuestPlayer)
                    this.join({ player:GuestPlayer, gid:this.id }).then(game=>{
                        console.log("2", GuestPlayer)
                        this.$emit('doLink', '/game/' + game.id + '/' + GuestPlayer.pid);
                    })
                });
            },
            gotoGame(gid: number) {
                // NOTE: This seems... gross?
                this.$emit('doLink', "/game/" + gid + '/' + this.player.pid);
            },
            newGame() {
                const player = this.player;
                return this.init({ player, type: 'QUICK'})
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
}
.traditional {
    background: #a20c05;
}
</style>
