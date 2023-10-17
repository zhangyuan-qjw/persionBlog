<template>
    <div class="diary-box">
        <div class="box" v-for="item in store.getAlbinismArticlesByPage(store.albinism_article_page)"
            @click="Changediary(item)">
            <div class="title">{{ item.title }}</div>
            <div class="briefly" v-html="getFirstParagraph(item.content)"></div>
            <div class="time">{{ store.formatTime(item.pub_time) }}</div>
        </div>
        <div class="page_button" @click="nextPage" v-show="isNext">→</div>
        <div class="page_last" v-show="store.albinism_article_page > 1" @click="lastPage">←</div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useStore } from "@/store/index"
import { get } from "@/utils/api"

const store = useStore();

const props = defineProps({
    diaryOpen: Boolean
});

const isNext = ref(false)
setTimeout(()=>{
    isNext.value = true    
}, 500)

const emits = defineEmits(['update:diaryOpen']);

function Changediary(article: any) {
    emits("update:diaryOpen", !props.diaryOpen);
    store.setAlbinismArticle(article);
}

const nextPage = async () => {
    const albinism_article = await get("/articles/", { article_type: "albinism", page: store.albinism_article_page + 1 });
    if (albinism_article.code == 400) {
        alert("没有更多文章了");
        return;
    } else {
        store.addAlbinismArticlePage(1);
        store.setAlbinismArticles(albinism_article.data);
    }
}

const lastPage = async () => {
    store.addAlbinismArticlePage(-1);
}

//获取文章第一段
function getFirstParagraph(content: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const paragraphs = doc.getElementsByTagName('p');
    if (paragraphs.length > 0) {
        return paragraphs[0].textContent;
    }
    return "";
}
</script>

<style lang="scss" scoped>
.diary-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    position: relative;

    .box {
        width: 80%;
        height: 5rem;
        border-radius: 10px;
        box-shadow: 0 0 10px #ccc;
        padding: 20px;
        margin: 10px;


        .title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .briefly {
            height: 2.9rem;
            font-size: 0.9rem;
            line-height: 1.5;
            // background-color: aqua;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .time {
            font-size: 0.8rem;
            // line-height: 1.5;
            text-align: right;
        }

        &:hover {
            box-shadow: 0 0 10px #aaa;
            cursor: pointer;
        }
    }

    .page_button {
        width: 37%;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 1.5rem;
        font-weight: bold;
        color: #fff;
        background-color: #ccc;
        border-radius: 10px;
        box-shadow: 0 0 10px #ccc;
        margin: 20px;

        &:hover {
            box-shadow: 0 0 10px #aaa;
            cursor: pointer;
        }
    }

    .page_last {
        width:37%;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 1.5rem;
        font-weight: bold;
        color: #fff;
        background-color: #ccc;
        border-radius: 10px;
        box-shadow: 0 0 10px #ccc;
        margin: 20px;

        &:hover {
            box-shadow: 0 0 10px #aaa;
            cursor: pointe
        }
    }
}

// }

//移动端适配
@media screen and (max-width: 768px) {
    .diary-box {
        .box {
            width: 90%;
            height: 80%;
            border-radius: 10px;
            box-shadow: 0 0 10px #ccc;
            padding: 15px;
            margin: 10px;
        }
    }
}
</style>