<template>
    <div class="mt-10 text-3xl mx-auto max-w-6xl">
        <div v-if="id">
            <div>{{ player.name }}</div>
            <div>total: {{ total }}</div>
            <div>id: {{ gid }}</div>
            <div>canPlay: {{ canPlay }} </div>

            <div>To Play: {{ history[history.length-1] }}</div>
            <div>History: {{ history }}</div>
            <div>Tiles: {{ tiles }}</div>
            <div>Selected: {{ selected }}</div>
            <ul class="grid grid-cols-3 gap-2">
            <li v-for="(number, index) in range" v-bind:key="index">
                <button v-on:click="select(number)" :disabled="!canRemove(number)">{{ number }}</button>
            </li>
            </ul>
            <div>
                <template v-if="status.win || status.lose">
                    <h2>Game Over {{ player.name }}, You {{ status.win ? "WIN" : "LOSE" }}!</h2>
                    <ul>
                        <li>Score: {{ status.score }}</li>
                    </ul>
                </template>
                <template v-else>
                    <button v-on:click="rollDice(player, id, 1)">Roll 1</button>
                    <button v-on:click="rollDice(player, id, 2)">Roll 2</button>
                    <button v-on:click="pick()">Pick {{ selected }}</button>
                </template>
                <button v-on:click="newGame()">New Quick Game</button>
            </div>
        </div>
        <div v-else>
            <div>
                <input v-model="player.name" placeholder="Player Name" />
                <button v-on:click="newQuickGame()">New Game</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent } from 'vue';
    
    export default defineComponent({
        props: ['id'],
        data() {
            return {
                user: {
                    name: "Player 1"
                },
                range: [1,2,3,4,5,6,7,8,9],
                selected: [] as Array<number>
            }
        },
        created() {
            if(this.id){
                this.setup(this.id);
            }
        },
        beforeDestroy() {
            // if(this.channel){
            //     this.channel.close();
            // }
        },
        watch: {
            gid(newValue, oldValue) {
                if(!this.id) window.location.href="http://localhost:8080/game/" + newValue;
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
                return this.players[0] || this.user;
            }
        },
        methods: {
            ...mapActions('pandoraModule', [
                'init',
                'setup',
                'reset', 
                'rollDie',
                'Pick',
                'Cast'
            ]),
            select(n: number){
                if(this.selected.includes(n)){
                    this.selected.filter(s=> s !== n);
                } else {
                    this.selected.push(n);
                }
            },
            pick(){
                const player = this.player;
                const id = this.id;
                const solution = this.selected;
                this.Pick({player, id, solution});
                this.selected = [];
            },
            rollDice(player:any, id:number, d:number){
                this.Cast({player, id, d});
            },
            start() {
                return window.location.href="http://localhost:8080/game/" + this.id
            },
            newGame() {
                const player = this.player;
                return this.init({ player, type: 'QUICK'})
            },
            newQuickGame(){
                const { name } = this.user;
                return this.init({ name, type:"QUICK" }).then((game)=>window.location.href="http://localhost:8080/game/" + game.id);  
            },
            canRemove(n:number) {
                return this.tiles.indexOf(n) >= 0 ? true : false;
            }
        }
  })
</script>