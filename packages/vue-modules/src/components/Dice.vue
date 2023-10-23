<template>
    <h2>range:{{ range }}</h2>
    <h3>selected: {{ selected }}</h3>
    <h4>can play: {{ canPlay }}</h4>
    <div class="container dice-box" 
        v-touch:hold="handleHold"
        v-touch:swipe="handleSwipeUp"
        @pointerdown="pointerDown"
        @pointerup="pointerUp">
        <div class="dice-wrap"
            v-for="(die, d) in dice"
            v-touch:swipe="handleSwipeUp"  
            v-touch="handleTap(d)" 
            :class="{ 
                selected: inSelected(d), 
                rolling: rolling && inSelected(d)
            }">
            <div class="dice" 
                v-bind:key="d" 
                :class="['dice-' + proper[d], showDie(d, die)]">
                <div v-for="(side, si) in 6" class='side' :class="[proper[side-1]]" v-bind:key="si" >
                    <div v-for="(dot, i) in side" class="dot" :class="[proper[side-1] + '-' + dot]" v-bind:key="i"></div>
                </div>
            </div> 
    </div>
    </div>
</template>
<script lang="ts">
    // https://lenadesign.org/2020/06/18/roll-the-dice/
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent, ref } from 'vue';
    const rolling = ref(false);
    export default defineComponent({
    props: ['id','player'],
    data(){
        return {
            dice: [1,6],
            rolling,
            pointer: {
                active:false,
                last:0,
                newPosX:0, 
                newPosY:0, 
                startPosX:0, 
                startPosY:0
            },
            proper:['one', 'two', 'three', 'four', 'five', 'six'],
            selected: [] as Array<number>
        }
    },
    computed: {
        ...mapGetters('pandoraModule', [
            'history',
            'canPlay'
        ]),
        range() {
            const h = this.history; // History
            const l = h.length -1; // Last
            const p = h[l]; // Playable
            return p ?? [];
        }
    },
    methods: {
        ...mapActions('pandoraModule', [
            'Cast'
        ]),
        showDie(i:number, d:number){
            return this.selected.includes(i) ? 'show-' + this.range[i] : "";
        },
        inSelected(i:number){
            return this.selected.includes(i);
        },
        rollDice(player:any, id:number, d:number){
            if(this.player && this.id) this.Cast({player, id, d});
        },
        pointerDown(e:Event) {
            // this.pointer.startPosX = e.screenX;
            // this.pointer.startPosY = e.screenY;
            this.pointer.active = true;
            this.rolling=true;
            this.pointer.last = new Date().valueOf();
        },
        pointerMove(e:Event){
        //     if(this.pointer.active){
        //     console.log(e)
        //     // calculate the new position
        //     this.pointer.newPosX = this.pointer.startPosX - e.screenX;
        //     this.pointer.newPosY = this.pointer.startPosY - e.screenY;

        //     // with each move we also want to update the start X and Y
        //     this.pointer.startPosX = e.screenX;
        //     this.pointer.startPosY = e.screenY;
        //     console.log(e.target)
        //     // set the element's new position:
        //     e.target.style.top = (e.target.offsetTop - this.pointer.newPosY) + "px";
        //     e.target.style.left = (e.target.offsetLeft - this.pointer.newPosX) + "px";
        // }
        },
        pointerUp(){
            this.rolling = false;
            const pointer = new Date().valueOf();
            if(pointer > this.pointer.last + 1000){
                this.pointer.last = pointer;
                this.rollDice(this.player, this.id, this.selected.length);
            }
            this.pointer.active=false;
        },
        handleHold(){

        },
        handleTap(id:number){
            if(this.canPlay.length > 0) return;
            const handler = (direction:any, mouseEvent:Event) =>{
                if(this.selected.includes(id)){
                    const filtered = this.selected.filter(sid => sid !== id);
                    this.selected = filtered;
                } else {
                    this.selected.push(id);
                }
            }

            return handler;
        },
        mounted(){

        },
        handleSwipeUp(){
            if(this.player && this.id){
                this.rolling = false;
                this.rollDice(this.player, this.id, this.selected.length);
            } 
        }
    }
  });
</script>
<style>
.container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top:50px;
}
.dice-wrap {
    scale: 75%;
    position: relative;
    display: inline-block;
    min-width: 320px;
    min-height: 100px;
    left: 25%;
}

.dice {
    pointer-events: none;
    position: absolute;
    width: 100px;
    height: 100px;
    transform-style: preserve-3d;
    transition: transform 1s; 
}

.dice-wrap.rolling .dice-one{
    animation: rolling 3s infinite ease-in-out;
    animation-direction: alternate;
    animation-delay: 500ms;
}

.dice-wrap.rolling .dice-two{
    animation: rolling 3s infinite ease-in-out;
    animation-direction: alternate-reverse;
    animation-delay: 500ms;
}

.dot {
  position: absolute;
  width: 20px;
  height: 20px;
  margin: -10px 5px 5px -10px;
  border-radius: 20px;
  background-color: #ef233c;
  box-shadow: inset 2px 2px #d90429;}

.side {
  position: absolute;
  background-color: rgba(255,255,255,0.7);
  border-radius:5px;
  width: 100px;
  height: 100px;
  border: 1px solid #e5e5e5;
  text-align: center;
  line-height: 2em;
}

.dice-wrap.selected .side{
    background-color: rgba(239,35,60, 0.7);
    border: 1px solid #ef233c;;
}

.dice-wrap.selected .side .dot {
    background-color: #fff;
  box-shadow: inset 2px 2px #f2f2f2;
}
  

.side:nth-child(1) {
  transform: translateZ(3.1em); }

.side:nth-child(6) {
  transform: rotateY(90deg) translateZ(3.1em); }

.side:nth-child(3) {
  transform: rotateY(-90deg) translateZ(3.1em); }

.side:nth-child(4) {
  transform: rotateX(90deg) translateZ(3.1em); }

.side:nth-child(5) {
  transform: rotateX(-90deg) translateZ(3.1em); }

.side:nth-child(2) {
  transform: rotateY(-180deg) translateZ(3.1em); }

.two-1, .three-1, .four-1, .five-1, .six-1 {
  top: 20%;
  left: 20%; }

.four-3, .five-3, .six-4 {
  top: 20%;
  left: 80%; }

.one-1, .three-2, .five-5 {
  top: 50%;
  left: 50%; }

.four-2, .five-2, .six-3 {
  top: 80%;
  left: 20%; }

.two-2, .three-3, .four-4, .five-4, .six-6 {
  top: 80%;
  left: 80%; }

.six-2 {
  top: 50%;
  left: 20%; }

.six-5 {
  top: 50%;
  left: 80%; 
}
</style>
<style lang="scss" noscript>
.dice-wrap {
  position: relative;
  display: inline-block;
  min-width: 100px;
  min-height: 100px;
  &.selected {
    .side{
        
    }
  }
}

.dice {
    position: absolute;;
    min-width: 100px;
    min-height: 100px;
    transform-style: preserve-3d;
    transition: transform 1s; 
    pointer-events: none;
    
    .side {
        position: absolute;
        background-color: #ffF;
        border-radius:5px;
        width: 100px;
        height: 100px;
        border: 1px solid #e5e5e5;
        text-align: center;
        line-height: 2em;

        .dot {
            position: absolute;
            width: 20px;
            height: 20px;
            margin: -10px 5px 5px -10px;
            border-radius: 20px;
            background-color: #f25f5c;
            box-shadow: inset 2px 2px #d90429;
        }
    }
}

.side:nth-child(1) {
  transform: translateZ(3.1em); }

.side:nth-child(6) {
  transform: rotateY(90deg) translateZ(3.1em); }

.side:nth-child(3) {
  transform: rotateY(-90deg) translateZ(3.1em); }

.side:nth-child(4) {
  transform: rotateX(90deg) translateZ(3.1em); }

.side:nth-child(5) {
  transform: rotateX(-90deg) translateZ(3.1em); }

.side:nth-child(2) {
  transform: rotateY(-180deg) translateZ(3.1em); }

.show-1 { transform: rotateX(720deg) rotateZ(-720deg); }

.show-2 { transform: rotateX(-900deg) rotateZ(1080deg); }

.show-6 { transform: rotateY(-450deg) rotateZ(-1440deg); }

.show-3 { transform: rotateY(810deg) rotateZ(720deg); }

.show-4 { transform: rotateX(-810deg) rotateZ(-1080deg); }

.show-5 { transform: rotateX(450deg) rotateZ(-720deg); }


.two-1, .three-1, .four-1, .five-1, .six-1 {
  top: 20%;
  left: 20%; 
}

.four-3, .five-3, .six-4 {
  top: 20%;
  left: 80%; }

.one-1, .three-2, .five-5 {
  top: 50%;
  left: 50%; }

.four-2, .five-2, .six-3 {
  top: 80%;
  left: 20%; }

.two-2, .three-3, .four-4, .five-4, .six-6 {
  top: 80%;
  left: 80%; }

.six-2 {
  top: 50%;
  left: 20%; }

.six-5 {
  top: 50%;
  left: 80%; 
}
@keyframes rolling {
    0% {
        transform: rotateX(720deg) rotateZ(-720deg);
    }
    25% {
        transform: rotateX(-900deg) rotateZ(1080deg); 
    }
    50% {
        transform: rotateY(-450deg) rotateZ(-1440deg);
    }
    75% {
        transform: rotateX(-810deg) rotateZ(-1080deg);
    }
    100% {
        transform: rotateX(450deg) rotateZ(-720deg); 
    }
}
</style>