<template>
    <div class="diced"             
         draggable="true" 
         @dragstart="handleDragStart"
         @dragend="handleDragEnd" 
         @click="handleClick" 
         @tap="handleTap"
         :class="[selected.includes('diced'+di) ? 'selected' :'']" 
         @dragover.prevent 
         v-for="(die, di) in range" :id="'diced' + di">
        <div 
             :id="'dice' + di" 
             v-bind:key="di" 
             class="dice" 
             :class="['dice-' + proper[di],'show-' + die]"
            >
            <div v-for="(side, si) in 6" class='side' :class="[proper[side-1]]" v-bind:key="si" >
                <div v-for="(dot, i) in side" class="dot" :class="[proper[side-1] + '-' + dot]" v-bind:key="i"></div>
            </div>
        </div> 
   </div>
</template>
<script lang="ts">
    // https://lenadesign.org/2020/06/18/roll-the-dice/
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent } from 'vue';

    export default defineComponent({
    props: ['id','player'],
    data(){
        return {
            rolling: false,
            proper:['one', 'two', 'three', 'four', 'five', 'six'],
            selected: [] as Array<string>
        }
    },
    computed: {
        ...mapGetters('pandoraModule', [
            'gid',
            'history',
            'players',
        ]),
        range() {
            // NOTE: Why can't we just make this a css3 animations?
            // Some kind of shake function
            const rnd = [[6,1], [5,2], [4,3]];
            const rndi = Math.floor(Math.random() * (3) + 1);

            const h = this.history; // History
            const l = h.length -1; // Last
            const p = h[l]; // Playable
            const d = p && p.length > 0 ? p : rnd[rndi];

            return d;
        }
    },
    methods: {
        ...mapActions('pandoraModule', [
            'Cast'
        ]),
        rollDice(player:any, id:number, d:number){
            this.Cast({player, id, d});
        },
        handleTap(e:Event){
            alert("tap");
            console.log(e)
        },
        handleDragStart(event:DragEvent){
            this.rolling = true;
            if(event && event.dataTransfer && event.dataTransfer.effectAllowed){
                event.dataTransfer.effectAllowed = 'move';
                const img = new Image();
                event.dataTransfer.setDragImage(img, -99999, -99999);
            }
            this.rollDice(this.player, this.gid, this.selected.length);
        },
        handleDragEnd(event:DragEvent) {
            this.rolling = false;
        },
        handleClick(e:Event){
            this.rolling = true;
            const { id } = e.target as HTMLInputElement;
            if(this.selected.includes(id)){
                const filtered = this.selected.filter(elem => elem !== id);
                this.selected = filtered;
            } else {
                this.selected.push(id);
            }

            this.rolling = false;
        }
    }
  });
</script>
<style>
.dice {
  position: relative;
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
  transition: transform 1s; }

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
  background-color: #ffF;
  border-radius:5px;
  width: 100px;
  height: 100px;
  border: 1px solid #e5e5e5;
  text-align: center;
  line-height: 2em;
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
<style lang="scss">

.diced {
  position: relative;
  display: inline-block;
  min-width: 100px;
  min-height: 100px;
  &.selected {
    .side{
        background-color: khaki;
        box-shadow: 0 0 0 3px #70cdff;
    }
  }
}

.dice {
    position: relative;
    min-width: 100px;
    min-height: 100px;
    transform-style: preserve-3d;
    transition: transform 1s; 
    pointer-events: none;
    transform:rotate3d(1, 1, 1, 45deg);

    &.dice-one {
        position: absolute;
    }

    &.dice-two {
        position: absolute;
    }
    
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

.show-6 { transform: rotateY(-450deg) rotateZ(-1440deg); }

.show-3 { transform: rotateY(810deg) rotateZ(720deg); }

.show-4 { transform: rotateX(-810deg) rotateZ(-1080deg); }

.show-5 { transform: rotateX(450deg) rotateZ(-720deg); }

.show-2 { transform: rotateX(-900deg) rotateZ(1080deg); }

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
</style>