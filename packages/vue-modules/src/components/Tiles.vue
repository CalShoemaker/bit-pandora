<template>
    <div class="grid grid-cols-3 facet" :class="{ enabled: _canPlay.length > 0 }">
        <div v-for="(number, index) in state.range" 
             v-bind:key="index" 
             class="flip-card" 
             :class="{ 
                given: given.includes(number),
                selected: selected.includes(number), 
                taken:!_tiles.includes(number), 
                lament: state.lament,
                closed: !state.active && selected.includes(number)
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
        setup() {

            const range = reactive([1,2,3,4,5,6,7,8,9]);
            const active = ref(true);
            const lament = ref(false);

            const state = reactive({
                range,
                lament: lament.value,
                active: active.value
            });

            return {
               state
            }
        },
        data(){
            return {
                given: [] as Array<number>,
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
            ]),
            _history(){
                return toRaw(this.status.players)+0 > 1 ? this.player.games.current.history : this.history;
            },
            _canPlay(){
                return toRaw(this.status.players)+0 > 1 ? this.player.games.current.canPlay : this.canPlay;
            },
            _range(){
                return toRaw(this.status.players)+0 > 1 ? this.player.games.current.tiles : this.state.range;
            },
            _tiles(){
                return toRaw(this.status.players)+0 > 1 ? this.player.games.current.tiles : this.tiles;
            },
        },
        methods: {
            ...mapActions('pandoraModule', [
                'Pick'
            ]),

            give(n: number){
                const handler = (direction:any, mouseEvent:Event) => {
                    
                    const given = this.given;
                    const canPlay = this._canPlay;
                    const canPlayFlat = this._canPlay.flat();
                    const selected = this.selected;
                    const _history = this._history;
                    const history = _history[_history.length-1];
                    

                    let gSum = given.reduce((p:number, a:number) => p + a, n);
                    let sSum = selected.reduce((p:number, a:number) => p + a, 0);
                    let hSum = history.reduce((p:number, a:number) => p + a, 0);


                    if(given.includes(n)){
                        this.given = given.filter(i=>i!==n);
                    } else if(!given.includes(n) && !selected.includes(n) && canPlayFlat.includes(n)){
                        this.given.push(n);
                        
                        if(gSum + sSum === hSum){
                            debugger
                            this.pick();
                        }
                    }
                }

                return handler;
            },
            select(n: number){
                const handler = (direction:any, mouseEvent:Event) => {
                    const history = this._history;
                    const canPlay = this._canPlay;
                    const selected = this.selected;
                    const given = this.given;
                    
                    
                    if(this._canPlay.length === 0) return;
                    const sum = (a:Array<number>, s:number) => a.reduce((p:number, a:number) => p + a, s);
                        
                    // NOTE: Simple game has a limit of 2 (sometimes 3), Pandora mode is any of sum.
                    const config = {
                        pickLimit: -1
                    };

                    // NOTE: Much of this sanitization logic exists server side.

                    // Last game impression of dice thrown, fallback to empty
                    const last = history[history.length-1] || [];

                    // Flatten array of array of numbers
                    const flatCanPlay = canPlay.flat();

                    // Is selected number in solution space?
                    const inFlatCanPlay = flatCanPlay.includes(n);

                    // Flatten selected
                    const flatSelected = selected.flat();
                    const flatGiven = given.flat();

                    // Sum inline destructures proxy. Through function returns proxy
                    const gSum = flatGiven.reduce((p:number, a:number) => p + a, 0);
                    const nSum = flatSelected.reduce((p:number, a:number) => p + a, n);
                    const dSum = last.reduce((p:number, a:number) => p + a, 0);


                    // Max of solution space or sum of dice. 
                    const maxCanPlay = Math.max(...flatCanPlay) > dSum ? Math.max(...flatCanPlay) :dSum;
                    console.log({nSum, gSum, dSum,inFlatCanPlay, flatSelected, history, canPlay, selected, given})

                    if(gSum === dSum || gSum + nSum === maxCanPlay && gSum + nSum === dSum){
                        this.selected.push(n);
                        this.pick();
                    }

                    // Game config conditions
                    if(config.pickLimit !== -1){
                        if(this.tiles.includes(n) && selected.length < 2 && flatCanPlay ){
                            this.selected.push(n);
                        } 
                        if( selected.length === 2 || maxCanPlay === n){
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
                            this.state.active = false;
                            //setTimeout(()=>{
                                this.state.active = true;
                                this.pick();
                            //}, 750);
                        } else 
                        // Add to selected if in solution space
                        if(inFlatCanPlay && !this.selected.includes(n) && !this.given.includes(n)) {
                            this.selected.push(n);
                        }
                    }
                }

                return handler;
            },
            pick() {
                const selected = this.selected;
                const given = this.given;
                const player = this.player;
                const id = this.id;
                const solution = {give:given, take:selected}
                this.selected = [];
                console.log("pick",{selected, given, player, id, solution});
                return this.Pick({player, id, solution});
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
.flip-card.selected .flip-card-inner,
.flip-card.closed .flip-card-inner{ 
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

.flip-card.closed .flip-card-back {
    background-color: #61120e;
    box-shadow: 1px 1px 5px 5px rgba(255,255,255,0.5) inset,
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
<style lang="scss">
.facet {
    .flip-card {
        background-color: transparent;
        width: 135px;
        height: 135px;
        perspective: 1000px; /* Remove this if you don't want the 3D effect */
        
        /* Do an horizontal flip when you move the mouse over the flip box container */
        &:hover,
        &.selected, 
        &.taken {
            .flip-card-inner{
                transform: rotateX(180deg);
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