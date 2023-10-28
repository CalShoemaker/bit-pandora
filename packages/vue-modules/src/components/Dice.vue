<template>
    <div class="dice-box relative flex-none"
        v-if="player" 
        v-touch:swipe="handleSwipeUp"
        @pointerdown="pointerDown"
        @pointerup="pointerUp">

        <div class="dice-wrap"
            v-for="(die, d) in dice"
            v-touch:swipe="handleSwipeUp"  
            v-touch="handleTap(d)" 
            :class="{ 
                selected: inSelected(d), 
                rolling: rolling && inSelected(d),
                waiting: canPlay && canPlay.length > 0 && inSelected(d)
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
    import { defineComponent, ref, reactive } from 'vue';
    

    export default defineComponent({
    props: ['id', 'pid', 'player', 'canPlay', 'history'],
    data(){
      return {
        rolling: false,
        dice: [1,6],
        proper: ['one', 'two', 'three', 'four', 'five', 'six'],
        selected: [0,1],
        pointer: {
            active:false,
            last:0,
            newPosX:0, 
            newPosY:0, 
            startPosX:0, 
            startPosY:0
        }
      }
    },
    computed: {
        ...mapGetters('pandoraModule', [
            'status'
        ]),
        range() {
            const h = this.history; // History
            const l = h ? h.length -1 : 0; // Last
            const p = h ? h[l]: []; // Playable
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
        rollDice(player:any, id:number, d:number) {
          console.log({player: this.player, id: this.id})
            if(this.player && this.id) this.Cast({player, id, d});
        },
        pointerDown(e:Event) {

            this.pointer.active = true;
            this.rolling = true;
            this.pointer.last = new Date().valueOf();
            setTimeout(() => {
                if(this.rolling){
                    this.pointerUp(null);
                }
            }, 3000);
        },
        pointerUp(e:Event | null) {
              this.rolling = false;
              const pointer = new Date().valueOf();

              if(pointer > this.pointer.last + 1000){
                  this.pointer.last = pointer;
                  this.rollDice(this.player, this.id, this.selected.length);
              }
              this.pointer.active = false;
  
        },
        handleTap(id:number){
            const handler = (direction:any, mouseEvent:Event) =>{
                if(this.canPlay.length > 0) return;
                if(this.selected.includes(id)){
                    const filtered = this.selected.filter(sid => sid !== id);
                    this.selected = filtered;
                } else {
                    this.selected.push(id);
                }
            }

            return handler;
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
  .dice-box {
    max-height: 90px;
    margin: 0 auto;
    border: 1px dashed #900b04;
  }

  .inlay-text {
    pointer-events: none;
    color: rgba(0,0,0,0.3);
    text-shadow: -1px -1px rgba(0,0,0,0.5);
    font-weight: bold;
    text-transform: uppercase;
    position: absolute;
    top: 25%;
  }

  .dice-wrap {
      scale: 70%;
      position: relative;
      display: inline-block;
      min-width: 100px;
      min-height: 100px;
      top: -5px;
      transition: top 1s ease-in-out;
  }

  .dice-wrap.selected {
    pointer-events: none;
  }

  .dice-wrap.selected.waiting:nth-child(2) {
      left: 25%;
  }

    .dice {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
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

.dice-wrap.waiting {
  pointer-events: all;
    position: relative;
    top: -70vh;
    transition: top 1.2s ease-in-out;
}


.dice-wrap.waiting:nth-child(1) {
  animation: bounce 1.2s 1 ease-in-out, left 1.2s 1 ease-in-out;
}

.dice-wrap.waiting:nth-child(2) {
  animation: bounce 1.2s 1 ease-in-out, right 1.2s 1 ease-in-out;
}

.dice-wrap.waiting .dice {

    animation: rolling 750ms 1 ease-in-out;
} 

.dice-wrap.waiting .dice-two {
    animation-direction: alternate-reverse;
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
  


.dice-wrap.selected .side{
    background-color:rgba(227, 218, 201, 1);
    border: 1px solid rgb(149, 139, 121);
    box-shadow: 1px 1px 10px 5px #aa9983 inset; 
}

.dice-wrap.selected .side .dot {
    background-color: #ef233c;
    box-shadow: inset 2px 2px rgba(0,0,0,0.2);
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

@keyframes bounce{
    0% {
        transform: scale(75%);
    }
    25% {
        transform: scale(100%);
    }
    50% {
        transform: scale(150%);
    }
    75% {
        transform: scale(100%);
    }
    100% {
        transform: scale(75%);
    }
}

@keyframes right {
    0% {
        left: 25%;
    }
    25% {
        left:55%;
    }
    50% {
        left:60%;
    }
    75% {
        left:50%;
    }
    100% {
        left:25%
    }
}

@keyframes left {
    0% {
        left:25%;
    }
    25% {
        left:5%;
    }
    50% {
        left:20%;
    }
    75% {
        left:35%;
    }
    100% {
        left:25%
    }
}

</style>