<template>
  <div class="mt-10 text-3xl mx-auto max-w-6xl">
    <div>Name: vue-modules</div>
    <div>Framework: vue3</div>
    <div>Language: TypeScript</div>
    <div>CSS: Tailwind</div>
  </div>
  <Game />
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import Game from './components/Game.vue'
  export default defineComponent({
    components: {
      Game
    }
  });
</script>
