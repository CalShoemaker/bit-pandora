<template>
    <div class="flex flex-col mt-5" ref="scene">
        <Cube v-if="false">
            <template v-slot:game>
                <Tiles :player="player" :id="id" />
            </template>
        </Cube>
        <Tiles v-else :player="player" :id="id" />
        <div>
            <template v-if="status && status.win || status && status.lose">
                <h2>Game Over {{ player.name || "booo" }}, You {{ status.win ? "WIN" : "LOSE" }}!</h2>
                <ul>
                    <li>Score: {{ status.score }}</li>
                </ul>
                <button v-on:click="newGame()">New Quick Game</button>
            </template>
        </div>
        <Player :id="id" :player="player" />
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent, ref } from 'vue';
    import Player from './Player.vue';
    import Tiles from './Tiles.vue';
    import Cube from './Cube.vue';
    
    export default defineComponent({
        props: ['id', 'pid'],
        data(){
            return {
                isFullscreen: false,
                range: [1,2,3,4,5,6,7,8,9],
                selected: [] as Array<number>
            }
        },
        setup() {
            const scene = ref(null);
            return { scene };
        },
        created() {
            if(this.id){
                this.setup(this.id)
            }
        },
        watch: {
            // Watches the gameid and navigates to new game
            gid(newID, oldID) {
                if(!this.id || newID !== oldID) {
                   this.gotoGame(newID);
                }
            }
        },
        computed: {
            ...mapGetters('pandoraModule', [
                'gid',
                'tiles', 
                'total', 
                'history',
                'players',
                'canPlay',
                'status'
            ]),
            player() {
                return this.players[0] || {
                    name: 'boo',
                    games: {
                        history: []
                    }
                };
            }
        },
        methods: {
            ...mapActions('pandoraModule', [
                'init',
                'setup'
            ]),
            fullScreen(){
                if(this.scene){
                 
                }
            },
            gotoGame(gid: number) {
                this.$emit('doLink', "/game/" + gid + '/' + this.player.pid);
            },
            newGame() {
                const player = this.player;
                return this.init({ player, type: 'QUICK'})
            },
            canRemove(n:number) {
                return this.tiles.indexOf(n) >= 0 ? true : false;
            }
        },
        components: {
            Player,
            Tiles,
            Cube
        }
  })
</script>
