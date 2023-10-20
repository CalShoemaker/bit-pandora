<template>
    <div class="grid grid-cols-3 gap-2" 
         @dragover.prevent
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
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: ['id', 'player'],
        data(){
            return {
                range: [1,2,3,4,5,6,7,8,9],
                selected: [] as Array<number>
            }
        },
        computed: {
            ...mapGetters('pandoraModule', [
                'tiles', 
                'total', 
                'history',
                'players',
                'canPlay',
                'status'
            ])
        },
        methods: {
            ...mapActions('pandoraModule', [
                'Pick'
            ]),
            select(n: number){
                const config = {
                    pickLimit: -1
                };

                const flatCanPlay = this.canPlay.flat();
                const inFlatCanPlay = flatCanPlay.includes(n);
                const maxCanPlay = Math.max(...flatCanPlay);
                const flatSelected = this.selected.flat();
                const sumFlatSelected = flatSelected.reduce((p, a) => p+ a, 0);
                const nSum = sumFlatSelected + n;

                if(config.pickLimit !== -1){
                    if(this.tiles.includes(n) && this.selected.length < 2 && flatCanPlay ){
                        this.selected.push(n);
                    } 

                    if( this.selected.length === 2 || maxCanPlay === n){
                        this.pick();
                    }
                } else {
                    if(nSum > maxCanPlay){
                        this.selected = [];
                    } else if(nSum === maxCanPlay){
                        this.selected.push(n);
                        this.pick();
                    } else {
                        this.selected.push(n);
                    }
                }
            },
            pick(){
                const player = this.player;
                const id = this.id;
                const solution = this.selected;
                this.Pick({player, id, solution});
                this.selected = [];
            }
        },
        components: {

        }
    })
</script>
<style>
.flip-card {
  background-color: transparent;
  width: 150px;
  height: 100px;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner,
.selected  .flip-card-inner,
.taken  .flip-card-inner{
  transform: rotateY(180deg);
}


/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}

.taken .flip-card-back{
    background-color: navy;
}
</style>