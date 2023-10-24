<template>
  <div class="gradient"></div>
  <div class="relative flex max-h-screen flex-col overflow-hidden vport">
    <router-view @do-link="doLink"></router-view>
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
    background-image: url("media/images/temple-city.png");
    background-size: 110% 110%;              /* <------ */
    background-repeat: no-repeat;
    background-position: 0 0;  
    animation: gradient 60s ease infinite;

    .vport{
      border-style: solid;
      border-width: 2px;
      border-image-slice: 0 0 1 0;
      border-image: linear-gradient(135deg, #245862ff, #2EF9FAff, #32A6B0ff, #3B6571ff, #78097Fff, #EB2A67ff, #CB2193ff, #D7389Cff) 1;
    }
    
    #bitPandoraHost{
      max-width: 430px;
      margin:0 auto;

      .gradient {
        pointer-events: none;
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom: 0;
        opacity: 0.5;
        background: linear-gradient(315deg, #245862ff, #2EF9FAff, #32A6B0ff, #3B6571ff, #78097Fff, #EB2A67ff, #CB2193ff, #D7389Cff);
        background-size: 400% 400%;
        animation: gradient 30s ease infinite;
      }
    }
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

@supports (-webkit-touch-callout: none) {
  .max-h-screen {
    height: calc(100vh - 80px);
  }
}
</style>
