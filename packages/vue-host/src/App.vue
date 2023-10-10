<template>
  <div class="mt-10 text-3xl mx-auto max-w-6xl">
    <h1>Bit Pandora {{ total }}</h1>
    <Game />
  </div>
</template>

<script lang="ts">
  import { mapGetters } from 'vuex';
  import { defineComponent } from 'vue'
  import  Game from "vue_modules/Game";
  export default defineComponent({
    data(){
      
    },
    components: {
      Game
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
