<template>
    <div class="new-player relative flex flex-col p-5">
        <div class="p-5">
            <input type="text" :value="name" @input="updateValue" :placeholder="name" />
        </div>
        <div class="p-5">
            <label v-for="emoj in emojis" :key="emoj.code">
                <input type="radio" class="emoji hidden" :value="JSON.stringify(emoj)" v-model="emoji" @change="updateEmoji" />
                <span class="player-icon">{{ emoj.icon }}</span>
            </label>
        </div>
    </div>
</template>
<script lang="ts">
    import { mapGetters, mapActions } from 'vuex';
    import { defineComponent } from 'vue';
    import emojis from '../services/emoji.service';

    export default defineComponent({
        props:['name'],
        data(){
            return {
                emoji:0,
                emojis
            }
        },
        methods:{
            updateValue: function (e: Event) {
               this.$emit('name', (e!.target as HTMLInputElement)!.value);
            },
            updateEmoji: function (e: Event) {
               this.$emit('emoji', (e!.target as HTMLInputElement)!.value);
            }
        }
    })
</script>
<style>
    .new-player {   
        background-color: rgb(253, 0, 0);
        background:linear-gradient(rgba(255, 0, 0, 0.5), rgba(0,0,0,0.2)); 
    }
    .player-icon{
        text-align: center;
        display: inline-block;
        font-size: 3em;
        background:#fff;
        border:2px solid #000;
        width: 75px;
        height: 75px;
        overflow: hidden;
        border-radius: 45px;
        margin: 15px;
    }
    input[type="radio"]:checked+span{
        border: 4px solid #f00;
    }
</style>