<template>
  <div class="relative flex max-h-screen flex-col overflow-hidden bg-gray-800">
    <div class="relative sm:mx-auto">
      <router-view @do-link="doLink"></router-view>
    </div>
  </div>
</template>


<script lang="ts">
  import { defineComponent } from 'vue';

  // TODO: Background gradient with this color: 70c1b3
  export default defineComponent({
    methods: {
      doLink(target:string) {
        this.$router.push(target)
      }
    }
  })
</script>
<style lang="scss">
body {
  user-select: none;
    -webkit-user-select:none;
}
@supports (-webkit-touch-callout: none) {
  .max-h-screen {
    height: calc(100vh - 80px);
  }
}
</style>