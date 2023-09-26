<template>
    <div class="modal-container" v-if="other.isFrom">
        <div class="modal">
            <h1>文章提交</h1>
            <form @submit.prevent="submitForm">
                <label for="title">标题:</label>
                <input v-model="title" id="title" name="title" type="text" required>
                <label for="role">选择角色:</label>
                <select v-model="selectedRole" id="role" name="role">
                    <option value="albinism">白化</option>
                    <option value="ZhangYuan">章远</option>
                    <option value="you">你</option>
                    <option value="Chen Yuang">陈羽昂</option>
                    <option value="me">我</option>
                </select>
                <div class="btn-container">
                    <button class="btn" type="submit">确定</button>
                    <button class="btn cancel" @click="cancelForm">取消</button>
                </div>
            </form>
        </div>
    </div>
    <GlobalDialog :Dialog="isDialog">{{ DialogText }}</GlobalDialog>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import { useOtherStore } from "@/store/other"
import { post } from '@/utils/api';
import GlobalDialog from './GlobalDialog.vue';
import { routers } from '@/routers';

const other = useOtherStore()

const DialogText = ref('')
const isDialog = ref(false)

const title = ref('')
const selectedRole = ref('albinism') // 默认选中白化

async function submitForm() {
    // 可以在这里处理表单提交逻辑
    other.chnageisFrom()
    if (other.text !== '<p><br></p>') {
        const res = await post('/addArticle/', {
            title: title.value,
            content: other.text,
            article_type: selectedRole.value
        })
        isDialog.value = true
        DialogText.value = res.data
        setTimeout(() => {
            isDialog.value = false
            routers.push('/')
        }, 1000)
    }else{
        isDialog.value = true
        DialogText.value = '文章不能为空'
        setTimeout(() => {
            isDialog.value = false
        }, 1000)
    }
}
function cancelForm() {
    // 可以在这里处理取消操作
    other.chnageisFrom()
}
</script>
  
<style scoped lang="scss">
.modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 999;
}

.modal {
    width: 90%;
    /* 调整弹框宽度为 90% */
    max-width: 500px;
    /* 添加最大宽度 */
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    text-align: center;

    h1 {
        color: #000;
    }

    label {
        display: block;
        margin-top: 10px;
        color: #000;
    }

    input,
    select {
        width: 50%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .btn-container {
        margin-top: 20px;
    }

    .btn {
        display: inline-block;
        padding: 10px 20px;
        margin-right: 10px;
        background-color: #000;
        color: #fff;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }

    .btn.cancel {
        background-color: #888;
    }
}

@media screen and (max-width: 600px) {

    /* 在小屏幕上调整样式 */
    .modal {
        width: 85%;
    }
}
</style>
  