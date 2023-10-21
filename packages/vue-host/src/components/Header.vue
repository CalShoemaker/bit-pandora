<template>
    <header class="flex p-2 bg-gray-900 text-white">
      <div class="grow p-2">Bit Pandora</div>
    </header>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    methods: {
      doLink(target:string) {
        console.log("do link", target);
        this.$router.push(target)
      }
    }
  })
</script>