<template>
    <div class="player">
        <Dice :id="id" :player="player" />
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
                'history',
                'players',
                'canPlay',
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
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>