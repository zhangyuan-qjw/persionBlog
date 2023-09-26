<template>
    <div class="diary-box">
        <div class="box" v-for="item in store.getAlbinismArticlesByPage(store.albinism_article_page)"
            @click="Changediary(item)">
            <div class="title">{{ item.title }}</div>
            <div class="briefly" v-html="getFirstParagraph(item.content)"></div>
            <div class="time">{{ store.formatTime(item.pub_time) }}</div>
        </div>
        <div class="page_button" @click="nextPage">→</div>
        <div class="page_last" v-show="store.albinism_article_page > 1" @click="lastPage">←</div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from "@/store/index"
import { get } from "@/utils/api"

const store = useStore();

const props = defineProps({
    diaryOpen: Boolean
});

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
    // background-color: aqua;

    .box {
        width: 80%;
        height: 80%;
        border-radius: 10px;
        box-shadow: 0 0 10px #ccc;
        padding: 20px;
        margin: 20px;

        .title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .briefly {
            font-size: 0.9rem;
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
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
        width: 30%;
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
        width: 30%;
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