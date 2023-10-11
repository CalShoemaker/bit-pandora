<template>
    <div class="mt-10 text-3xl mx-auto max-w-6xl">
        <div>total: {{ total }}</div>
        <div>dice: {{ lastInSeries }}</div>
        <div>canPlay: {{ canPlay }} </div>
        <ul class="grid grid-cols-3 gap-2">
        <li v-for="(number, index) in defaultRange" v-bind:key="index">
            <button v-on:click="remove(number)" :disabled="!canRemove(number)">{{ number }}</button>
        </li>
        </ul>
        <button v-on:click="rollDie(2)">Roll Dice</button>
        <button v-on:click="reset()">Reset</button>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent } from 'vue';
    
    export default defineComponent({
        data(){
            return {
                defaultRange: [1,2,3,4,5,6,7,8,9],
                availableRange:[]
            }
        },
        components: {
            
        },
        computed: {
            ...mapGetters('pandoraModule', [
                'tiles', 
                'total', 
                'series',
                'lastInSeries',
                'canPlay'
            ])
        },
        methods: {
            ...mapActions('pandoraModule', [
                'remove', 
                'reset', 
                'rollDie'
            ]),

            canRemove(n:number) {
                return this.tiles.indexOf(n) >= 0 ? true : false;
            }
        }
  })
</script>