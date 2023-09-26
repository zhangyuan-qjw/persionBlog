<template>
    <div v-html="store.albinism_article.content" class="content"></div>
    <div class="back" @click="Changediary">←</div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { onMounted } from 'vue';

const store = useStore();

//到达该页面时要求当前元素框的滚动条回到顶部
onMounted(() => {
    const content = document.querySelector('.content');
    if (!content) return;
    content.scrollTop = 0;
});

const props = defineProps({
    diaryOpen: Boolean
});

const emits = defineEmits(['update:diaryOpen']);

function Changediary() {
    emits("update:diaryOpen", !props.diaryOpen);
}

</script>

<style lang="scss" scoped>
.back {
    //绝对定位，小一点
    position: absolute;
    // top: 10px;
    bottom: -10px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #fff;
    color: #000;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 0 10px #000;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
        box-shadow: 0 0 20px #000;
    }
}
</style>