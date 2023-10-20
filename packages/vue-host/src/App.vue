<template>
  
  <div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gradient-to-t from-blue-900 via-indigo-900 to-gray-900">
    <Header />
    <div class="relative bg-blue-200 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto">
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
      // ...mapGetters('pandoraModule', [
      //     'gid',
      //     'tiles', 
      //     'total', 
      //     'history',
      //     'players',
      //     'canPlay',
      //     'status'
      // ])
    }, 
    methods: {
      doLink(target:string) {
        console.log("do link", target);
        this.$router.push(target)
      }
    },
    components:{
      Header
    }
  })
</script>
