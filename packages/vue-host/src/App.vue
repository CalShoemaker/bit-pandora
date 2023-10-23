<template>
  <div class="relative flex max-h-screen flex-col overflow-hidden bg-gray-800">
    <Header class="sticky top-0 z-50" />
    <div class="relative sm:mx-auto">
      <router-view @do-link="doLink"></router-view>
    </div>
  </div>
</template>


<script lang="ts">
  import { mapGetters } from 'vuex';
  import { defineComponent } from 'vue';
  import Header from "./components/Header.vue"

  // TODO: Background gradient with this color: 70c1b3
  export default defineComponent({
    computed: {

    }, 
    methods: {
      doLink(target:string) {
        this.$router.push(target)
      }
    },
    components:{
      Header
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