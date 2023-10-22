<template>
    <div>
        <input v-model="name" placeholder="Player Name" />
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-on:click="newQuickGame()">New Quick Game</button>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent } from 'vue';

    export default defineComponent({
        data(){
            return {
                name:''
            }
        },
        methods: {
            ...mapActions('pandoraModule', [
                'init',
                'setup',
                'newPlayer'
            ]),
            newQuickGame(){
                console.log(this.name)
                if(this.name.length > 2){
                    this.newPlayer(this.name).then(UserPlayer => {
                        this.init({ player:UserPlayer, type:"QUICK" }).then(game=>{
                            this.$emit('doLink', 'game/' + game.id + '/' + UserPlayer.pid);
                        })
                    });
                }
            },
        }
    })
</script>