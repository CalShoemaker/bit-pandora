<template>
    <div class="grid grid-cols-3 facet" :class="{ enabled: _canPlay.length > 0 }">
        <div v-for="(number, index) in range" 
             v-bind:key="index" 
             class="flip-card" 
             :class="{ 
                given: given.includes(number),
                selected: selected.includes(number), 
                taken:!_tiles.includes(number),
                closed: !opponent.games.current.tiles.includes(number)
            }" >
            <div class="flip-card-inner flex items-center justify-center" v-touch:longtap="give(number)" v-touch="select(number)">
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

    export default defineComponent({
        props: ['id', 'player'],

        data(){
            return {
                given: [] as Array<number>,
                selected: [] as Array<number>,
                range:[1,2,3,4,5,6,7,8,9] as Array<number>
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
            ]),

            // TODO: Move these wrappers to somewhere else. Maybe pass from parent.
            // NOTE: As a matter of fact... 'Tiles' really shouldn't know or do all of this.
            _history(){
                return this.status.players > 1 ? this.player.games.current.history : this.history;
            },
            _canPlay(){
                return this.status.players > 1 ? this.player.games.current.canPlay : this.canPlay;
            },
            _tiles(){
                return this.status.players > 1 ? this.player.games.current.tiles : this.tiles;
            },
            opponent(){
                const ps = JSON.parse(JSON.stringify(this.players));
                const psKeys = Object.keys(ps);
                const player = JSON.parse(JSON.stringify(this.player));
                const playerI = psKeys.indexOf(player.pid);
                psKeys.splice(playerI);
                const opponentI = psKeys.pop() || "";
                return ps[opponentI];
            }
        },
        methods: {
            ...mapActions('pandoraModule', [
                'Pick'
            ]),

            give(n: number){
                const handler = (direction:any, mouseEvent:Event) => {
                    
                    const given = this.given;
                    const canPlay = this._canPlay;
                    const selected = this.selected;
                    const history = this._history;
                    
                    this.pushOrPop(given, selected, n);

                    if(this.canPick(history, selected, given, canPlay, n)){
                        this.pick();
                    }
                }

                return handler;
            },
            canPick(h:Array<Array<number>>, s:Array<number>, g:Array<number>, c:Array<number>, n:number){
                const sum = (a:Array<number>, s:number) => a.reduce((p:number, a:number) => p + a, s);
                const l = h[h.length - 1] as Array<number>;
                const gSum = sum(g, 0);
                const nSum = sum(s, 0);
                const dSum = sum(l, 0);
                const flatCanPlay = c.flat();
                const inFlatCanPlay = flatCanPlay.includes(n);
                const maxCanPlay = Math.max(...flatCanPlay, dSum);

                if(nSum > maxCanPlay) { this.selected = []; }
                if(gSum > maxCanPlay) { this.given = []; }
                
                return nSum === maxCanPlay && inFlatCanPlay || gSum === maxCanPlay || gSum + nSum === maxCanPlay;
            },
            pushOrPop(t:Array<number>, f:Array<number>, n: number){
                if(!t.includes(n) && !f.includes(n)) {
                    t.push(n);
                } else {
                    const i = t.indexOf(n);
                    t.splice(i);
                }
            },
            select(n: number){
                const handler = (direction:any, mouseEvent:Event) => {
                    // Reject on no play
                    const canPlay = this._canPlay;
                    if(canPlay.length === 0) return;
                    
                    // Push or splice
                    const selected = this.selected;
                    const given = this.given;
                    const history = this._history;
                    
                    this.pushOrPop(selected, given, n);

                    if(this.canPick(history, selected, given, canPlay, n)){
                        this.pick();
                    }
                }

                return handler;
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
                return this.selected = [];
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

.flip-card.closed .flip-card-inner .tile,
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
