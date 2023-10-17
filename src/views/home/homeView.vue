<template>
    <div class="big-box">
        <header>
        </header>
        <div class="card-box">
            <cardView></cardView>
            <chatSearch></chatSearch>
        </div>
    </div>
</template>

<script lang="ts" setup>
import cardView from "./homepart/cardView.vue"
import chatSearch from "./homepart/chatSearch.vue";

defineProps({
    Dialog: {
        type: Boolean,
    }
})
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>