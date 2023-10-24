<template>
    <div class="new-game">
        <div class="relative flex flex-col p-5">
            <div>
                <label>Player Name</label>
                <input v-model="name" placeholder="Player Name" />
            </div>
            <div>
                <input type="checkbox" v-model="isFlat" />
                <label for="isFlat">3D Active</label>
            </div>
            <div>
                <input type="checkbox" v-model="isTraditional" />
                <label for="isTraditional">Traditional</label>
            </div>
            <div>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-on:click="newQuickGame()">New Quick Game</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent, ref } from 'vue';

    export default defineComponent({
        setup(){
            const name = ref('');
            const isFlat = ref(false);   
            const isTraditional = ref(true);  
            return {
                name,
                isFlat,
                isTraditional
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
                    this.newPlayer({name: this.name, isTraditional:this.isTraditional, isFlat:this.isFlat }).then(UserPlayer => {
                        this.init({ player:UserPlayer, type:"QUICK" }).then(game=>{
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