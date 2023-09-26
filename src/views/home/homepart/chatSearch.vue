<template>
    <div class="search" ref="outer">
        <div contenteditable="true" class="text" @focus="focus" @blur="blur" @input="handleInput" @keydown.enter="send">{{
            textInput }}</div>
        <span class="role" @click="changeRole">
            {{ chatRole }}
        </span>
        <i class="iconfont icon-fasong" @click="send"></i>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useTalkRoleStore } from '@/store/talkRole';
import { useRoute } from 'vue-router';
import { routers } from '@/routers';

const talkRoleStore = useTalkRoleStore();
const route = useRoute();

const textInput = ref('对话...');

const chatRole = ref('邱');

const roles = ['邱', '白', '章', '陈', '你', '我']

//全局监听键盘事件
window.addEventListener('keydown', (event) => {
    //阻止浏览器默认事件
    if (event.key === 'Tab') {
        event.preventDefault();
        changeRole();
    }
    if (event.ctrlKey) {
        chatRole.value = '邱'
    }
});

function blur() {
    if (textInput.value === '') {
        textInput.value = '对话...';
    }
}

function focus() {
    if (textInput.value === '对话...') {
        textInput.value = '';
    }
}

function handleInput(event: any) {
    textInput.value = event.target.innerText;
}


const send = (event: any) => {
    //阻止空消息发送
    if (textInput.value === '对话...' || textInput.value === '') {
        return;
    }
    //阻止默认事件
    event?.preventDefault();
    chat()
    textInput.value = '';
    if (route.path === '/') {
        routers.push('/chat');
    }
}

//获取当前时间
const getTime = () => {
    // 获取当前日期时间
    const now = new Date();
    // 获取年、月、日、小时和分钟
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 添加获取秒数的代码
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 包含秒数
    return formattedDateTime;

}

const chat = () => {
    talkRoleStore.setmessages({
        role: chatRole.value,
        time: `${getTime()}`,
        message: textInput.value
    })
}

const changeRole = () => {
    //每次changeRole都会切换到下一个角色
    const index = roles.indexOf(chatRole.value)
    if (index === 5) {
        chatRole.value = roles[0];
    } else {
        chatRole.value = roles[index + 1];
    }
}
</script>

<style lang="scss" scoped>
.search {
    display: flex;
    align-items: center;
    width: 25rem;
    margin: 0 auto;
    margin-top: 100px;
    border-radius: 10px;
    padding: 5px 15px;
    height: auto;
    background: black;
    box-shadow: 0 2px 4px rgba(black, 0.1);
    overflow-y: auto;

    .text {
        font-weight: 600;
        width: 100%;
        max-height: 8em;
        margin-left: -5px;
        margin-right: auto;
        padding: 3px;
        outline: 0;
        font-size: 12px;
        overflow-x: hidden;
        overflow-y: auto;
        color: white;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .search-input {
        border: none;
        outline: none;
        color: #eee;
        font-weight: 600;

        &::placeholder {
            color: white;
            font-weight: 600;
        }
    }

    .role {
        margin-left: 10px;
        border-radius: 5px;
        width: 25px;
        height: 25px;
        background: #eee;
        color: black;
        font-size: medium;
        font-weight: 600;
        line-height: 25px;
        text-align: center;
        cursor: pointer;
    }

    i {
        color: rgba(100, 251, 0, 0.929);
        font-size: 28px;
        margin-left: 10px;
        cursor: pointer;

        &:hover {
            color: rgba(100, 251, 0, 0.829);
        }

    }
}

//移动端
@media screen and (max-width: 768px) {
    .search {
        width: 15rem;
        border-radius: 10px;
    }
}
</style>