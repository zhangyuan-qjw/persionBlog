<template>
    <div class="card">
        <div class="text" :class="{ 're-text': isBack }">{{ text }}</div>
        <div class="role-status">
            <router-link to="/albinism">白化</router-link>
            <router-link to="/boring">章远</router-link>
            <router-link to="/boring">陈羽昂</router-link>
            <router-link to="/boring">你</router-link>
            <router-link to="/boring">我</router-link>
        </div>
    </div>
    <div class="choose">
        <button class="yes" @click="choose('yes')">还行</button>
        <button class="no" @click="choose('no')">一样</button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const text = ref("你觉得今天无聊吗？")
const isBack = ref(false)
const choose = (chance: string) => {
    if (chance === "yes") {
        isBack.value = true
        setTimeout(() => {
            text.value = "但愿如此！"
            isBack.value = false
        }, 2000);
    }
    if (chance === "no") {
        isBack.value = true
        setTimeout(() => {
            text.value = "其实一直如此。"
            isBack.value = false
        }, 2000);
    }
}
</script>

<style lang="scss" scoped>
.card {
    position: relative;
    height: 15em;
    // background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;
    width: 90%;

    .text {
        // background-color: gainsboro;
        padding-left: 1.6rem;
        position: relative;
        overflow: hidden;
        font-size: 1.4rem;
        font-weight: 600;
        text-align: center;
        white-space: nowrap;
        animation: width 1.5s steps(13) forwards;

        &::after {
            content: "";
            position: absolute;
            right: 0px;
            height: 1.5rem;
            border-left: #000 2px solid;
            animation: showInfinite 0.5s infinite both;
        }
    }

    .role-status {
        position: absolute;

        a {
            //不换行
            white-space: nowrap;
            font-size: 0.9rem;
            color: #000;
            text-decoration: none;
        }

        bottom: 1rem;
    }

    .re-text {
        animation: re-width 1.5s steps(13) forwards;

    }
}

.choose {
    height: 4.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;
    width: 80%;
    display: flex;
    justify-content: space-around;

    button {
        width: 6rem;
        height: 2rem;
        border-radius: 0.5rem;
        border: none;
        outline: none;
        font-size: 1rem;
        font-weight: 600;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        color: #fff;
        background-color: #000;

        cursor: pointer;

        &:hover {
            background-color: #333;
        }
    }
}

@keyframes width {
    0% {
        width: 2px;
    }

    100% {
        //根据文本的宽度来设置
        width: 13em;
    }
}

@keyframes re-width {
    0% {
        width: 13em;
    }

    100% {
        width: 2px;
    }
}

@keyframes showInfinite {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>