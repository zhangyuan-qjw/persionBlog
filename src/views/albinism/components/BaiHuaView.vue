<template>
    <div class="card" v-for="item, key in BaiHua" :key="key" @click="DialogueShow">
        <img :src="`${url}media/${item.image}`" alt="">
        <div class="dialogue">
            <p style="text-align: start;" v-for="message, index in item.messages" :key="index">
                <strong>{{ message.role }}</strong>
                {{ ':' + message.message }}
            </p>
        </div>
        <div class="creat_time">{{ formatDate(item.data) }}</div>
    </div>
    <div class="bottom">
        <div class="previous" @click="changePage(-1)" v-show="page_number != 1">上一页</div>
        <div class="next" @click="changePage(1)" v-show="isNext">下一页</div>
    </div>
    <GlobalDialog :Dialog="isDialog">{{ DialogText }}</GlobalDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue"
import { get } from "@/utils/api";
import GlobalDialog from "@/components/GlobalDialog.vue";
import { message_type } from "@/store/talkRole";

const url = import.meta.env.VITE_BASE_URL

interface BaiHua_type {
    id?: string,
    title: string,
    data: string,
    image: string,
    messages: message_type[]
}

const isDialog = ref(false)
const DialogText = ref('')

const BaiHua = ref<BaiHua_type[]>([])
const page_number = ref(0)

const isNext = ref(false)

onMounted(async () => {
    changePage(1)
})

const changePage = async (num: number) => {
    isNext.value = false
    page_number.value += num
    const res = await get('all_record/', {
        page: page_number.value
    })
    if (res.code == 200) {
        BaiHua.value = res.data
        if (handleBackTop) {
            handleBackTop();
        }
        isNext.value = true
    } else {
        page_number.value -= 1
        isDialog.value = true
        DialogText.value = res.msg
        setTimeout(() => {
            isDialog.value = false
        }, 1000)
    }
}

const DialogueShow = (event: any) => {
    const dialogue = event.currentTarget.querySelector('.dialogue') as HTMLElement
    dialogue.classList.toggle('dialogueShow')
}

//格式化时间
const formatDate = (time: string) => {
    const date = new Date(time)
    return date.toLocaleString()
}

//导入父组件的方法
const handleBackTop = inject<() => void>('handleBackTop');

</script>

<style lang="scss" scoped>
.card {
    margin-bottom: 3.5rem;
    width: 100%;
    height: 23rem;
    display: flex;
    position: relative;

    img {
        width: 55%;
        height: 100%;
        object-fit: cover;
    }

    .dialogue {
        width: 45%;
        height: 100%;
        padding-left: 1rem;
        overflow-y: auto;
        font-size: medium;

        //隐藏滚动条
        &::-webkit-scrollbar {
            display: none;
        }
    }

    .creat_time {
        position: absolute;
        bottom: -1.5rem;
        left: 0;
        font-weight: 300;
        font-size: small;
    }
}

.bottom {
    width: 100%;
    position: relative;

    .previous {
        position: absolute;
        left: 0;
        height: 25px;
        width: 60px;
        background-color: black;
        color: white;
        border-radius: 10px;
        text-align: center;
        line-height: 25px;
        font-size: xx-small;
        font-weight: 600;
        cursor: pointer;
    }

    .next {
        position: absolute;
        right: 0;
        height: 25px;
        width: 60px;
        background-color: black;
        color: white;
        border-radius: 10px;
        text-align: center;
        line-height: 25px;
        font-size: xx-small;
        font-weight: 600;
        cursor: pointer;
    }
}

//移动端适配
@media screen and (max-width: 768px) {
    .card {
        height: 15rem;

        img {
            width: 100%;
            height: 15rem;
        }

        .dialogue {
            box-sizing: border-box;
            position: absolute;
            width: 100%;
            height: 15rem;
            padding-left: 0;
            overflow-y: scroll;
            //玻璃效果
            background-color: rgba(255, 255, 255, 0.3);
            //文本框出现阴影效果
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

            //滚动条样式
            &::-webkit-scrollbar-thumb {
                border-radius: 0.5rem;
                background-color: rgba(0, 0, 0, 0.5);
            }

            transition: all 0.5s;
            opacity: 0;
            visibility: hidden;
            padding: 1rem;
        }

        .creat_time {
            position: absolute;
            bottom: -1.5rem;
            left: 0;
            font-weight: 300;
            font-size: small;
        }

        .dialogueShow {
            visibility: visible;
            opacity: 1;
        }
    }
}
</style>
