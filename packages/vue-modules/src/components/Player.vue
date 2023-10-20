<template>
    <div class="flex p-2 bg-teal-800">
      <div class="grow p-2">{{ player.name }}</div>
      <div class="grow p-2">{{ player.games.history.length }}</div>
      <div class="grow p-2"> {{ canPlay.length ? history[history.length-1] : "" }}</div>
      <div class="grow p-2">
        <Dice :id="id" :player="player" />
      </div>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent } from 'vue';
    import Dice from './Dice.vue';

    export default defineComponent({
        props:['id', 'player'],
        computed: {
            ...mapGetters('pandoraModule', [
                'gid',
                'history',
                'players',
                'canPlay',
                'status'
            ])
        },
        methods: {
        // ...mapActions('pandoraModule', [
        //         'Pick',
        //         'Cast'
        //     ]),
        //     rollDice(player:any, id:number, d:number){
        //         this.Cast({player, id, d});
        //     },
        },
        components: {
            Dice
        }
    })
</script>