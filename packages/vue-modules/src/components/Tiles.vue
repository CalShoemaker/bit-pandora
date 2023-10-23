<template>
    <div class="grid grid-cols-3 facet" :class="{ enabled: canPlay.length > 0 }">
        <div class="flip-card" :class="{ selected: selected.includes(number), taken:!tiles.includes(number), lament: lament }" v-for="(number, index) in range" v-bind:key="index" >
            <div class="flip-card-inner flex items-center justify-center" v-touch="select(number)">
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
    import { defineComponent, ref } from 'vue';

    export default defineComponent({
        props: ['id', 'player'],
        setup() {
            const selected = ref([]);
            const range = ref([1,2,3,4,5,6,7,8,9])
            const lament = ref(false);
            return {
                lament,
                selected,
                range
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
                const handler = (direction:any, mouseEvent:Event) => {
                    if(this.canPlay.length === 0) return;
                    const sum = (a:Array<number>, s:number) => a.reduce((p:number, a:number) => p + a, s);
                        
                    // NOTE: Simple game has a limit of 2 (sometimes 3), Pandora mode is any of sum.
                    const config = {
                        pickLimit: -1
                    };

                    // NOTE: Much of this sanitization logic exists server side.

                    // Last game impression of dice thrown, fallback to empty
                    const last = this.history[this.history.length-1] || [];

                    // Flatten array of array of numbers
                    const flatCanPlay = this.canPlay.flat();

                    // Is selected number in solution space?
                    const inFlatCanPlay = flatCanPlay.includes(n);

                    // Flatten selected
                    const flatSelected = this.selected.flat();

                    // Sum inline destructures proxy. Through function returns proxy
                    const nSum = flatSelected.reduce((p:number, a:number) => p + a, n);
                    const dSum = last.reduce((p:number, a:number) => p + a, 0);

                    // Max of solution space or sum of dice. 
                    const maxCanPlay = Math.max(...flatCanPlay) > dSum ? Math.max(...flatCanPlay) :dSum;

                    // Game config conditions
                    if(config.pickLimit !== -1){
                        if(this.tiles.includes(n) && this.selected.length < 2 && flatCanPlay ){
                            this.selected.push(n);
                        } 
                        if( this.selected.length === 2 || maxCanPlay === n){
                            this.pick();
                        }
                    } else {
                        // Sum of selected is greater than max of canPlay: reset selected
                        if(nSum > maxCanPlay){
                            this.selected = [];
                        } else 
                        // Auto pick when exact
                        if(nSum === maxCanPlay){
                            this.selected.push(n);
                            this.pick();
                        } else 
                        // Add to selected if in solution space
                        if(inFlatCanPlay) {
                            this.selected.push(n);
                        }
                    }
                }

                return handler;
            },
            pick() {
                const player = this.player;
                const id = this.id;
                const solution = this.selected;
                this.selected = [];
                return this.Pick({player, id, solution});
            }
        }
    })
</script>
<style>
.facet {
    pointer-events: none;
}
.facet.enabled{
    pointer-events: all;
}
 /* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  width: 143px;
  height: 143px;
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
.flip-card.selected .flip-card-inner,
.flip-card.taken .flip-card-inner { 
    transform: rotateY(180deg); 
}

.flip-card.selected .flip-card-back{
    background-color: #9aceeb;
    color: black;
}
.flip-card.taken .flip-card-back { 
    background-color: navy;
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
</style>
<style lang="scss">
.facet {
    .flip-card {
        background-color: transparent;
        width: 148px;
        height: 148px;
        perspective: 1000px; /* Remove this if you don't want the 3D effect */
        
        /* Do an horizontal flip when you move the mouse over the flip box container */
        &:hover,
        &.selected, 
        &.taken {
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