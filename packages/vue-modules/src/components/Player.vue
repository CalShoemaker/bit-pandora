<template>
    <div class="player flex flex-row">
        <Dice :id="id" :pid="pid" :player="player" :history="history" :canPlay="canPlay"/>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent } from 'vue';
    import Dice from './Dice.vue';

    export default defineComponent({
        props:['id', 'player', 'pid', 'history', 'canPlay'],
        computed: {
            ...mapGetters('pandoraModule', [
                'players',
                'status'
            ])
        },
        components: {
            Dice
        }
    })
</script>
<style>
    .player {   
        background:linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)); 
    }
</style>