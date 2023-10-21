<template>
    <div class="grid grid-cols-3 facet" @dragover.prevent>
        <div class="flip-card lament" :class="{ selected: selected.includes(number), taken:!tiles.includes(number), }" v-for="(number, index) in range" v-bind:key="index" >
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
                const last = this.history[this.history.length-1] || [];
                const flatCanPlay = this.canPlay.flat();
                const inFlatCanPlay = flatCanPlay.includes(n);
                const flatSelected = this.selected.flat();
                const sumFlatSelected = flatSelected.reduce((p, a) => p+ a, 0);
                const nSum = sumFlatSelected + n;
                const dSum = last.reduce((p:number, a:number) => p + a, 0);
                const maxCanPlay = Math.max(...flatCanPlay) > dSum ? Math.max(...flatCanPlay) :dSum;

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
                    } else if(inFlatCanPlay) {
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
<style lang="scss">
.facet {
    background: rgba(0, 0, 0, 70%);
    box-shadow: 0px 0 1px 1px gold;
    animation: glow 10s infinite ease-in-out;
}
.flip-card {
    background-color: transparent;
    width: 150px;
    height: 150px;
    perspective: 1000px; /* Remove this if you don't want the 3D effect */
    
    /* Do an horizontal flip when you move the mouse over the flip box container */
    &:hover,
    &.selected, 
    &.taken  {
        .flip-card-inner{
            transform: rotateY(180deg);
        }
    }
    &.taken {
        .flip-card-back{
            background-color: navy;
        }
    }

    &.lament {
        .flip-card-front {
            color: black;
            background-image: url('../media/images/lament-config.jpg');
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-size: 470px;
            background-position: -162px -27px;
        }

        /* Style the back side */
        .flip-card-back {
            background-image: url('../media/images/lament-config.jpg');
            background-repeat: no-repeat;
            background-attachment: fixed;
            background-size: 470px;
            background-position: -10px -178px; 
            font-weight: bold;
            font-size: 1.2em;
            transform: rotateY(180deg);
        }

        &.taken{
            .flip-card-back { color:gold; background-position: -162px -177px; }
        }
    }

    /* This container is needed to position the front and back side */
    .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s;
        transform-style: preserve-3d;

        /* Position the front and back side */
        .flip-card-front, 
        .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden; /* Safari */
            backface-visibility: hidden;
        }

    }
}

@keyframes glow {
  0% {
    box-shadow: 0px 0 2px 1px gold;
  }
  25% {
    box-shadow: 0px 0 6px 3px gold;
  }
  50% {
    box-shadow: 0px 0 10px 5px gold;
  }
  75% {
    box-shadow: 0px 0 6px 3px gold;
  }
  100% {
    box-shadow: 0px 0 2px 1px gold;
  }
}
</style>