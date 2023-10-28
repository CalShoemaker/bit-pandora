<template>
    <div class="new-game">
        <div class="relative flex flex-col p-5">
            <div>
                <label>Player Name</label>
                <input v-model="name" placeholder="Player Name" />
            </div>
            <div>
                <label>Players</label>

                <select v-model="selected">
                    <option v-for="option in options" :value="option.id">
                        {{ option.name}}
                    </option>
                </select>
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
        data(){
            return {
                name: '',
                selected: 1,
                options: [
                    { name: 'One Player', id: 1 },
                    { name: 'Two Players', id: 2 }
                ]
            }
        },
        methods: {
            ...mapActions('pandoraModule', [
                'init',
                'setup',
                'newPlayer'
            ]),
            newQuickGame(){
                if(this.name.length > 2){
                    this.newPlayer({name: this.name }).then(UserPlayer => {
                        console.log(UserPlayer)
                        // this.init({ players:[UserPlayer], type:"QUICK", playerLen: this.state.players }).then(game=>{
                        //     this.$emit('doLink', 'game/' + game.id + '/' + UserPlayer.pid);
                        // })
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