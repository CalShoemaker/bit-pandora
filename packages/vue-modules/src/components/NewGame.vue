<template>
  <div class="new-game relative flex flex-col">
    <NewPlayer @name="updateName" @emoji="updateEmoji" :name="name" />
    <div class="relative flex flex-col p-5">
      <div>
        <select v-model="selected">
          <option v-for="option in options" :value="option.id">
            {{ option.name }}
          </option>
        </select>
      </div>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          :class="{ disable: name && name.length > 1 && emoji }"
          v-on:click="newQuickGame()"
        >
          New Quick Game
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { mapGetters, mapActions } from "vuex";
import { defineComponent, ref, reactive } from "vue";
import NewPlayer from "./NewPlayer.vue";
// TODO: (P4) data() => Ref, Reactive.
export default defineComponent({
  data() {
    return {
      name: "",
      emoji: null,
      selected: 1,
      options: [
        { name: "One Player", id: 1 },
        { name: "Two Players", id: 2 },
      ],
    };
  },
  methods: {
    ...mapActions("pandoraModule", ["init", "setup", "join", "newPlayer"]),
    updateName(a: any) {
      this.name = a;
    },
    updateEmoji(e: any) {
      this.emoji = e;
    },
    emojify: (e: string) => e + ";",
    newQuickGame() {
      if (this.name.length <= 2) return;
      // Create and register a new Player
      this.newPlayer({ name: this.name, emoji: this.emoji }).then(
        (UserPlayer) => {
          // Report Player ID to Host for connectivity & refresh resyncing.
          this.$emit("attachPlayer", UserPlayer.pid);
          // Create a game with anticipated player length.
          this.init({ type: "QUICK", playerLen: this.selected }).then(
            (game) => {
              // Request Host navigate with router to game
              this.$emit("doLink", "/game/" + game.id + "/");
            }
          );
        }
      );
    },
  },
  components: {
    NewPlayer,
  },
});
</script>
<style lang="scss">
.new-game {
  user-select: none;
  -webkit-user-select: none;
  height: calc(100vh - 80px);
  width: 100%;
}
</style>
