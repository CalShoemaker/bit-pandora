<template>
  <div class="mt-10 text-3xl mx-auto max-w-6xl">
    <h1>Bit Pandora {{ total }}</h1>
    <Game />
  </div>
</template>

<script lang="ts">
  import { mapGetters } from 'vuex';
  import { defineComponent, defineAsyncComponent } from 'vue';

  export default defineComponent({
    data(){
      
    },
    components: {
      Game: defineAsyncComponent(() => import("vue_modules/Game"))
    },
    computed: {
      ...mapGetters('pandoraModule', [
        'total'
      ])
    },
    methods: {

    }
  })

</script>
