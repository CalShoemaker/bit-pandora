<template>
    <Header class="sticky top-0 z-50" />
    <div class="flex p-2 bg-gray-900 text-white">
        <h2>Welcome to Bit Pandora.</h2>
        <p>Bit Pandora is a variation of Shut the Box. Roll dice &amp; select tiles corresponding to the resulting die cast.</p>
        
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