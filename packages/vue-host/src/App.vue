<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-t from-blue-900 via-indigo-900 to-gray-900">
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
        console.log("do link", target);
        this.$router.push(target)
      }
    },
    components:{
      Header
    }
  })
</script>
