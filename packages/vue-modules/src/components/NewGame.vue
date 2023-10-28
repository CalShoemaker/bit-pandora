<template>
    <div class="new-game">
        <div class="relative flex flex-col p-5">
            <div>
                <label>Player Name</label>
                <input v-model="state.name" placeholder="Player Name" />
            </div>
            <div>
                <input type="checkbox" v-model="state.isFlat" />
                <label for="isFlat">3D Active</label>
            </div>
            <div>
                <input type="checkbox" v-model="state.isTraditional" />
                <label for="isTraditional">Traditional</label>
            </div>
            <div>
                <label>Players</label>
                <input v-model="state.players" placeholder="Player Name" maxlength="1" max="2" />
            </div>
            <div>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-on:click="newQuickGame()">New Quick Game</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent, ref, reactive } from 'vue';

    export default defineComponent({
        setup(){
            
            const name = ref('');
            const isFlat = ref(false);   
            const isTraditional = ref(true); 
            const players = ref(1);

            const state = reactive({
                name: name,
                isFlat: isFlat,
                isTraditional: isTraditional,
                players: players
            });

            return {
                state
            } 
        },
        methods: {
            ...mapActions('pandoraModule', [
                'init',
                'setup',
                'newPlayer'
            ]),
            newQuickGame(){
                if(this.state.name.length > 2){
                    this.newPlayer({name: this.state.name, isTraditional:this.state.isTraditional, isFlat:this.state.isFlat }).then(UserPlayer => {
                        this.init({ players:[UserPlayer], type:"QUICK", playerLen: this.state.players }).then(game=>{
                            this.$emit('doLink', 'game/' + game.id + '/' + UserPlayer.pid);
                        })
                    });
                }
            },
        }
    })
</script>
<style lang="scss">
.new-game {
    user-select: none;
    -webkit-user-select:none;
    height: calc(100vh - 80px);
    width: 100%;
    background-image: url("../media/images/pandora-temple.png");
    background-size: cover;              /* <------ */
    background-repeat: no-repeat;
    background-position: center center;  
}
</style>