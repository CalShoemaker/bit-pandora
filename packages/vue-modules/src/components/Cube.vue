<template>
  <div class="scene">
    <div class="cube">
      <div class="cube__face cube__face--inside"></div>
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
// https://medium.com/codex/pure-css-animation-1-3d-cubes-f8ecc53ef16e
import { defineComponent } from "vue";

export default defineComponent({});
</script>
<style>
.scene {
  position: absolute;
  left: 4%;
  perspective: 600px;
  top: 20vh;
  animation: move 10s infinite ease-in-out;
  scale: 75%;
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
  width: 430px;
  height: 430px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 
.cube__face:not(.cube__face--inside) {
  outline: 2px solid #fff;
} */

.cube__face--inside {
  transform: rotateY(0deg) translateZ(0px);
}
.cube__face--front {
  transform: rotateY(0deg) translateZ(216px);
}
.cube__face--right {
  transform: rotateY(90deg) translateZ(216px);
}
.cube__face--back {
  transform: rotateY(180deg) translateZ(216px);
}
.cube__face--left {
  transform: rotateY(-90deg) translateZ(216px);
}
.cube__face--top {
  transform: rotateX(90deg) translateZ(216px);
}
.cube__face--bottom {
  transform: rotateX(-90deg) translateZ(216px);
}

@keyframes float {
  0% {
    transform: translateZ(-100px) rotateY(0deg) rotateX(0deg) rotateZ(0deg);
  }
  30% {
    transform: translateZ(-100px) rotateY(-5deg) rotateX(-5deg) rotateZ(0deg);
  }
  50% {
    transform: translateZ(-100px) rotateY(0deg) rotateX(0deg) rotateZ(0deg);
  }
  66% {
    transform: translateZ(-100px) rotateY(5deg) rotateX(5deg) rotateZ(0deg);
  }
  100% {
    transform: translateZ(-100px) rotateY(0deg) rotateX(0deg) rotateZ(0deg);
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
