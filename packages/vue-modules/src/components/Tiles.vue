<template>
    <div class="grid grid-cols-3 facet" :class="{ enabled: canPlay.length > 0 }">
        <div v-for="(number, index) in range" 
             v-bind:key="index" 
             class="flip-card" 
             :class="{ 
                given: given.includes(number),
                selected: selected.includes(number), 
                taken:!tiles.includes(number),
                closed: opponent && opponent.games.current && !opponent.games.current.tiles.includes(number)
            }" >
            <div class="flip-card-inner flex items-center justify-center" v-touch:longtap="click('give', number)" v-touch="click('take', number)">
                <div class="flip-card-front flex items-center justify-center">
                    <span class="tile">{{ number }}</span>
                </div>
                <div class="flip-card-back flex items-center justify-center">
                    <span class="tile">{{ number }}</span>
                </div>
            </div>
        </div> 
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent, ref, reactive, toRaw } from 'vue';

    type Conditions = {
        h: Array<Array<number>>, 
        s: Array<number>, 
        g: Array<number>, 
        c: Array<number>, 
        n: number
    }

    export default defineComponent({
        props: ['id', 'pid', 'player', 'opponent', 'history', 'canPlay', 'tiles'],

        data(){
            return {
                given: [] as Array<number>,
                selected: [] as Array<number>,
                range:[1,2,3,4,5,6,7,8,9] as Array<number>
            }
        },
        computed: {
            ...mapGetters('pandoraModule', [
                'players',
                'status'
            ]),

        },
        mounted(){
            console.log(this.history, this.canPlay, this.tiles)
        },
        methods: {
            ...mapActions('pandoraModule', [
                'Pick'
            ]),
            pushOrPop(t:Array<number>, f:Array<number>, n: number){
                if(!t.includes(n) && !f.includes(n)) {
                    t.push(n);
                } else {
                    const i = t.indexOf(n);
                    t.splice(i);
                }
            },
            click(a:string, n:number) {
                const handler = (direction:any, mouseEvent:Event) => {      
                    const h = this.history;
                    const s = this.selected;
                    const g = this.given; 
                    const c = this.canPlay;
                    if(c.length === 0) return false;

                    a === "take" ? this.pushOrPop(s, g, n) : this.pushOrPop(g, s, n);
                    return this.canPick({h, s, g, c, n}) ? this.pick() : null;
                }
                return handler
            },
            canPick(conditions:Conditions) {
                const { h, s, g, c, n} = conditions;
                const sum = (a:Array<number>, s:number) => a.reduce((p:number, a:number) => p + a, s);

                const state = {
                    sums: {
                        g: sum(g, 0),
                        s: sum(s, 0),
                        l: sum(h[h.length - 1], 0)
                    },
                    flats: {
                        c: c.flat() as Array<number>
                    },
                    max: function (){ return Math.max(...this.flats.c, this.sums.l) }
                }
               
                if(state.sums.s > state.max()) { this.selected = []; }
                if(state.sums.g > state.max()) { this.given = []; }
                
                return state.sums.s === state.max() && state.flats.c.includes(n) || state.sums.g === state.max() || state.sums.g + state.sums.s === state.max();
            },
            
            pick() {
                this.Pick({
                    player: this.player, 
                    id: this.id, 
                    solution: {
                        give: this.given, 
                        take: this.selected 
                    }
                });

                this.selected = [];
                this.given = [];
            }
        }
    })
</script>
<style>
.facet {
    pointer-events: none;
    border: 1px dashed #900b04;
    margin: 0 auto;
}

.facet.enabled{
    pointer-events: all;
}
.tiles {
}
.tile {
    display: block;
    width: 60px;
    height: 90px;
    line-height: 90px;
    font-size: 1.75em;
    font-weight: bolder;
    background-color: rgba(227, 218, 201, 1);
    box-shadow: 1px 1px 10px 5px #b09879 inset,3px 3px 0px 2px rgb(183, 157, 119);
    border-radius: 6px;
    border-left: 1px solid rgb(225, 210, 180);
    border-top: 1px solid rgb(202, 173, 152);
    border-right: 2px solid rgb(166, 150, 127);
    border-bottom: 2px solid rgb(157, 138, 110);
    text-shadow: -1px -1px 0 #fff;
    color: #900b04;
}

 /* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  width: 135px;
  height: 135px;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
  border: 1px dashed #900b04;
  box-shadow: 1px 1px 20px 0px rgba(0,0,0,0.1) inset;
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
.flip-card.selected .flip-card-inner { 
    transform: rotateX(180deg); 
}

.flip-card.given .flip-card-back,
.flip-card.given .flip-card-front{
    box-shadow: 1px 1px 10px 5px #ff0000 inset;
}

.flip-card.given .flip-card-back .tile,
.flip-card.given .flip-card-front .tile{
    background-color: rgb(120, 0, 0);
    color: #ff0d00;
    box-shadow: 1px 1px 10px 5px #ff0000,3px 3px 0px 2px rgb(132, 0, 0);
}

.flip-card.selected .flip-card-back .tile{
    color: #ff0d00;
    box-shadow: 1px 1px 10px 5px #b09879,3px 3px 0px 2px rgb(183, 157, 119);
}

.flip-card.closed .flip-card-front {
    background-color: #2d0000;
    border: 1px dashed rgb(255, 0, 0) inset,
}

.flip-card.taken .flip-card-inner .tile{
    display: none;
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

}

/* Style the back side */
.flip-card-back {
    transform: rotateX(180deg);
} 


</style>
