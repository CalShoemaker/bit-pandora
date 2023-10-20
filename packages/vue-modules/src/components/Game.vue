<template>
    <div class="flex flex-col bg-blue-200">
        <div>canPlay: {{ canPlay }} </div>
        <Tiles :player="player" :id="id" />
        <!-- <div class="grid grid-cols-3 gap-2" 
             @dragover.prevent
             @drop="handleDrop($event)"
            >
            <div class="flip-card" :class="{ selected: selected.includes(number), taken:!tiles.includes(number), }" v-for="(number, index) in range" v-bind:key="index" >
                <div class="flip-card-inner flex items-center justify-center" v-on:click="select(number)">
                    <div class="flip-card-front flex items-center justify-center">
                        {{ number }}
                    </div>
                    <div class="flip-card-back flex items-center justify-center">
                        {{ number }}
                    </div>
                </div>
            </div> 
            
        </div> -->
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
    import { defineComponent } from 'vue';
    import Player from './Player.vue';
    import Tiles from './Tiles.vue';

    export default defineComponent({
        props: ['id', 'pid'],
        data(){
            return {
                range: [1,2,3,4,5,6,7,8,9],
                selected: [] as Array<number>
            }
        },
        created() {
            if(this.id){
                this.setup(this.id).then(data=>{console.log("setup",data)});
            }
        },

        beforeDestroy() {
            // if(this.channel){
            //     this.channel.close();
            // }
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
            Tiles
        }
  })
</script>
