<template>
  <div class="mt-10 text-3xl mx-auto max-w-6xl">
    <h1>Bit Pandora {{ total }}</h1>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import { mapGetters } from 'vuex';
  import { defineComponent } from 'vue';

  export default defineComponent({
    computed: {
      ...mapGetters('pandoraModule', [
        'total'
      ])
    }
  })

</script>
