<template>
  
  <div class="flex">
    <header class="flex p-5 bg-slate-500">
      <div class="grow p-4">Bit Pandora</div>
      <div class="grow p-4">{{ player.name }} | {{ player.score }}</div>
      <div class="grow p-4">{{ player.games.history.length }}</div>
    </header>
    <div class="flex">
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
          'gid',
          'tiles', 
          'total', 
          'history',
          'players',
          'canPlay',
          'status'
      ]),
      player() {
          return this.players[0] || { name: "Player 1", score: 45, games: { history:[] } };
      }
    }
  })

</script>
