<template>
    <header>
        <div class="leftMune" @click="handleMune">
            <i class="iconfont icon-caidan" style="color: black; font-weight: 900; z-index: -1;"></i>
        </div>
        <div class="role" @click="addArticle">白化</div>
        <div class="back" @click="handleBack">←</div>
    </header>
    <section>
        <div class="side" :class="{ translate: isTranslate }" ref="side">
            <ul>
                <li v-for="(item, index) in muneList" :key="index" @click="handleClick(item)">
                    <span :class="{ activate: item.isActive }">{{ item.title }}</span>
                </li>
            </ul>
        </div>
        <div class="content" ref="content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <div :key="router.path">
                        <component :is="Component"></component>
                    </div>
                </transition>
            </router-view>
        </div>
        <div class="back-head" @click="handleBackTop" v-if="isShowBackTop">▲</div>
    </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, provide } from 'vue'
import { routers } from '@/routers/index'
import { useRoute } from "vue-router"

const router = useRoute()

const muneList = ref([
    { title: '白化', isActive: true, path: '/albinism/baiHua' },
    { title: '幻想日记', isActive: false, path: '/albinism/diary' },
    { title: '幻想图片', isActive: false, path: '/albinism/picture' },
    { title: '也许存在的哲学', isActive: false, path: '/albinism/philosophy' },
    { title: '起初的故事', isActive: false, path: '/albinism/tale' },
]);

onMounted(() => {
    const path = router.path
    muneList.value.forEach(i => {
        i.isActive = false
        if (i.path === path) {
            i.isActive = true
        }
    })
})

// 点击切换，并跳转到对应的路由
const handleClick = (item: any) => {
    muneList.value.forEach(i => i.isActive = false)
    item.isActive = true
    isTranslate.value = false
    routers.replace(item.path)
}

// 返回首页
const handleBack = () => {
    routers.replace("/")
}

//菜单栏的显示与隐藏
const isTranslate = ref(false)
const side = ref(null)
const handleMune = () => {
    isTranslate.value = true
}
const handleClickOutside = (e: any) => {
    if (isTranslate.value && !(((side.value) as unknown) as HTMLElement).contains(e.target) && e.target.className !== 'iconfont icon-caidan') {
        isTranslate.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    if (content.value) {
        content.value.addEventListener('scroll', handleScroll);
    }
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
    if (content.value) {
        content.value.removeEventListener('scroll', handleScroll);
    }
})

//添加文章
const addArticle = () => {
    if (router.path == '/albinism/diary') {
        routers.push('/baiHuaAddArticle')
    }
}

const content = ref<HTMLElement>()
// content元素滚动条返回顶部
function handleBackTop() {
    if (content.value) {
        content.value.scrollTo(0, 0)
    }
}

//导出父组件的方法
provide('handleBackTop', handleBackTop);

// 返回顶部按钮的显示与隐藏
const isShowBackTop = ref(false)
function handleScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    if (scrollTop > 800) {
        isShowBackTop.value = true;
    } else {
        isShowBackTop.value = false;
    }
}
</script>


<style lang="scss" scoped>
@import './index.scss'
</style>