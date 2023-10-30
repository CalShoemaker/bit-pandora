<template>
  <div class="relative flex max-h-screen flex-col overflow-hidden">
   
    <router-view @do-link="doLink" @attach-player="attachPlayer" v-slot="{ Component }" :key="$route.fullPath">
      <component :is="Component" :pid="pid"></component>
    </router-view>
  </div>
</template>


<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    data(){
      let bpPID = localStorage.getItem('bp-pid') || null;
      return {
        pid: bpPID ? +bpPID : null 
      }
    },
    methods: {
      resetPlayer(){
        localStorage.removeItem('bp-pid')
      },
      doLink(target:string) {
        this.$router.push(target)
      },
      
      attachPlayer(pid:string){
        localStorage.setItem('bp-pid', pid);
        this.pid = +pid;
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
    background-color:rgb(71, 4, 0);

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
