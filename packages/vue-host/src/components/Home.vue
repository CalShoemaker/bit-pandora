<template>
    <Header />
    <div class="flex flex-col p-5 bg-gray-900 text-white">
        <div>Welcome to Bit Pandora.</div>
        <div>Bit Pandora is a variation of Shut the Box. Roll dice &amp; select tiles corresponding to the resulting die cast.</div>
        <div>
            <router-link to="/newgame">New Game</router-link>
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from 'vue';
    import Header from "./Header.vue"
    export default defineComponent({
        components: {
            Header
        }
    })
</script>