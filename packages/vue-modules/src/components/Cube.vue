<template>
    <div class="scene">
        <div class="cube">
            <div class="cube__face cube__face--inside">
            </div>
            <div class="cube__face cube__face--front">
                <slot name="game"></slot>
            </div>
            <div class="cube__face cube__face--back">
                <slot name="game"></slot>
            </div>
            <div class="cube__face cube__face--right">

                <slot name="game"></slot>
            </div>
            <div class="cube__face cube__face--left">

                <slot name="game"></slot>
            </div>
            <div class="cube__face cube__face--top">

                <slot name="game"></slot>
            </div>
            <div class="cube__face cube__face--bottom">
                <slot name="game"></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
    })
</script>
<style>
.scene {
  position: relative;
  perspective: 600px;
  top: 10vh;
  animation: move 10s infinite ease-in-out;
  scale: 80%;
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(-100px);
  transform-style: preserve-3d;
  transition: transform 1s;
  animation: float 10s infinite ease-in-out;
}

.cube__face {
  position: absolute;
  width: 446px;
  height: 446px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 
.cube__face:not(.cube__face--inside) {
  outline: 2px solid #fff;
} */

.cube__face--inside{ transform: rotateY(  0deg) translateZ(  0px);}
.cube__face--front { transform: rotateY(  0deg) translateZ(224px); }
.cube__face--right { transform: rotateY( 90deg) translateZ(224px); }
.cube__face--back  { transform: rotateY(180deg) translateZ(224px); }
.cube__face--left  { transform: rotateY(-90deg) translateZ(224px); }
.cube__face--top   { transform: rotateX( 90deg) translateZ(224px); }
.cube__face--bottom{ transform: rotateX(-90deg) translateZ(224px); }

@keyframes float {
  0% {
    transform: translateZ(-100px) rotateY(-10deg) rotateX(-5deg) rotateZ(0deg);
  }
  30% {
    transform: translateZ(-100px) rotateY(-8deg) rotateX(-12deg) rotateZ(0deg);
  }
  50% {
    transform: translateZ(-100px) rotateY(-5deg) rotateX(-10deg) rotateZ(0deg);
  }
  66% {
    transform: translateZ(-100px) rotateY(-8deg) rotateX(-8deg) rotateZ(0deg);
  }
  100% {
    transform: translateZ(-100px) rotateY(-10deg) rotateX(-5deg) rotateZ(0deg);
  }
}

@keyframes move {
  0% {
    transform: translate(-60%, -50%);
  }
  25% {
    transform: translate(-50%, -60%);
  }
  50% {
    transform: translate(-40%, -50%);
  }
  75% {
    transform: translate(-50%, -40%);
  }
  100% {
    transform: translate(-60%, -50%);
  }
}
</style>