<template>
    <div style="border: 1px solid #ccc;">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
        <div class="smbit" @click="putArticle">提交</div>
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
            @onCreated="handleCreated" />
    </div>
    <GlobalFrom></GlobalFrom>
</template>

<script lang="ts" setup>
import GlobalFrom from './GlobalFrom.vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useOtherStore } from "@/store/other"

const other = useOtherStore()

const mode = 'simple'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

// 模拟 ajax 异步获取内容
// onMounted(() => {
//     setTimeout(() => {
//         valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//     }, 1500)
// })

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

function putArticle() {
    other.chnageisFrom()
    other.setText(valueHtml.value)
}
</script>


<style lang="scss" scoped>
.smbit {
    width: 100px;
    height: 40px;
    background-color: black;
    color: #fff;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
    margin-left: 10px;
    border-radius: 5px;
}
</style>