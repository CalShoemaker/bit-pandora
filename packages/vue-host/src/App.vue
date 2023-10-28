<template>
  <div class="relative flex max-h-screen flex-col overflow-hidden">
    <router-view @do-link="doLink" :key="$route.fullPath" v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
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
    height: calc(100vh - 80px);
    width: 100%;

    #bitPandoraHost{
      max-width: 430px;
      max-height: 850px;
      margin:0 auto;
    }
}

@supports (-webkit-touch-callout: none) {
  .max-h-screen {
    height: calc(100vh - 80px);
  }
}
</style>
