<template>
  <Game />
</template>

<script lang="ts">
  import { defineComponent, toRefs } from 'vue'
  import Game from './components/Game.vue'
  export default defineComponent({
    components: {
      Game
    }
  });
</script>
