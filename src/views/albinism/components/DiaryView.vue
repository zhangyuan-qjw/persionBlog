<template>
    <div class="diary">
        <component :is="diaryOpen? DiaryView:DiaryComponent" v-model:diaryOpen="diaryOpen">
        </component>
    </div>
</template>

<script lang="ts" setup>
import DiaryComponent from '@/components/DiaryComponent.vue';
import DiaryView from '@/components/DiaryView.vue'
import { onMounted } from "vue"
import { get } from "@/utils/api"
import { useStore } from "@/store/index"

const store = useStore();

import { ref } from 'vue'

const diaryOpen = ref(false)

//初始化文章数据
onMounted(async () => {
    if (store.albinism_artilces.length > 0) return;
    const albinism_article = await get("/articles/", { article_type: "albinism" });
    store.setAlbinismArticles(albinism_article.data);
})
</script>