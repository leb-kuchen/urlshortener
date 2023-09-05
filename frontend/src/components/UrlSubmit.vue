<script setup>
    import { ref } from "vue";
    import axios from "axios"
    const url = ref("")
    async function postUrl() {
        let res = await axios.get("api/shorturl/8")
        url.value = ""
        console.log(res)
    }
</script>

<template>
    <form @submit.prevent>
    <input v-model="url">
    <button @click="postUrl">Übermitteln</button>
    </form>
</template>