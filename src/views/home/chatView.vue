<template>
    <div class="chat_header">
        <i class="iconfont icon-shouye home" @click="routers.push('/')"></i>
        <i class="iconfont icon-ziyuanxhdpi history" ref="history" @click="handleClickHistory"></i>
        <div class="title" @click="isTitleBox = true" :title="title">
            📜{{ title }}
            <i class="iconfont icon-a-xiala2"></i>
        </div>
        <div class="title-box" v-show="isTitleBox">
            <div class="box rename" @click="renameFile">重命名</div>
            <div class="box save" @click="openSave">保存</div>
        </div>
    </div>
    <div class="chat" ref="scrollEle">
        <div :class="message.role === '邱' ? 'user' : 'role'" v-for="message in talkRoleStore.messages" :key="message.time">
            <div class="head" v-show="message.role !== '邱'">{{ message.role }}</div>
            <div class="message">{{ message.message }}</div>
            <div class="head" v-show="message.role === '邱'">{{ message.role }}</div>
        </div>
    </div>
    <div class="chat_input">
        <chatSearch></chatSearch>
    </div>
    <div class="history-box" v-show="isHistory" @click="handleClickNone">
        <div class="history-content">
            <i class="iconfont icon-cuowu"></i>
            <div class="history-item" v-for="item, index in talkRoleStore.talkHistory" :key="index"
                @click="handleHistory(item.id)">
                <div class="title">{{ item.title }}</div>
                <div class="date">{{ date(item.data) }}</div>
            </div>
        </div>
    </div>
    <!-- 弹框内容 -->
    <div class="modal" v-show="isSave">
        <h2>{{ title }}</h2>
        <p>这里需要选择上传的图片</p>
        <!-- 图片选择框 -->
        <label class="custom-file-upload">
            <input type="file" accept="image/*" @change="onUploadChange">
            选择图片
        </label>
        <div id="image-preview">{{ previewImage }}</div>
        <button class="button" @click="saveChat">确定</button>
        <button class="button cancel-button" @click="openSave">取消</button>
    </div>
    <GlobalDialog :Dialog="isDialog">{{ DialogText }}</GlobalDialog>
</template>

<script lang="ts" setup>
import chatSearch from './homepart/chatSearch.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useTalkRoleStore } from '@/store/talkRole';
import { routers } from '@/routers';
import { post, get } from '@/utils/api';
import GlobalDialog from '@/components/GlobalDialog.vue';

const isDialog = ref(false)
const DialogText = ref('')

const isSave = ref(false)

const talkRoleStore = useTalkRoleStore();

const title = ref('')
onMounted(() => {
    if (talkRoleStore.messages[0]) {
        title.value = talkRoleStore.messages[0].message
    } else {
        routers.push('/')
    }
})

function date(data: string) {
    const dateObject = new Date(data);
    // 格式化日期时间为所需格式
    const formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')} ${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}:${dateObject.getSeconds().toString().padStart(2, '0')}`;
    return formattedDate;
}

const isTitleBox = ref(false)
onMounted(() => {
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (isTitleBox.value && target.className !== 'title-box' && target.className !== 'title' && target.className !== 'iconfont icon-a-xiala2') {
            isTitleBox.value = false;
        }
    })
})

onBeforeUnmount(() => {
    if (localStorage.getItem('chat')) {
        localStorage.removeItem('chat')
    }
})

function renameFile() {
    const originalName = prompt("请输入新的文件名:");
    if (originalName !== null && originalName.trim() !== "") {
        // 在这里添加重命名文件的逻辑
        title.value = originalName;
        alert(`文件已重命名为: ${originalName}`);
    }
}
const isHistory = ref(false)
const handleClickHistory = () => {
    isHistory.value = true
    getHistory()
}
const handleClickNone = () => {
    isHistory.value = false
}

const openSave = () => {
    isSave.value = !isSave.value
}

const uploadImage = ref<any>()
const saveChat = async () => {
    openSave()
    const formData = new FormData();
    const chat = localStorage.getItem('chat')
    let res = {} as any
    if (!chat) {
        formData.append('image', uploadImage.value)
        formData.append('title', title.value)
        formData.append('messages', JSON.stringify(talkRoleStore.messages))
        res = await post('/fantasy/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    } else {
         //这个messages需要过滤一下,根据是否拥有id来判断
         const messages = talkRoleStore.messages.filter(item => !item.id)
        const data_from = {
            "id": chat,
            "title": title.value,
            "messages": messages
        }
        res = await post('/fantasy/', data_from)
    }
    if (res.code === 200) {
        isDialog.value = true
        DialogText.value = res.msg
        talkRoleStore.setMessages([]);
        localStorage.removeItem('chat')
        setTimeout(() => {
            isDialog.value = false
            routers.replace('/')
        }, 1000)
    } else {
        isDialog.value = true
        DialogText.value = "保存失败"
        setTimeout(() => {
            isDialog.value = false
        }, 1000)
    }
}

const getHistory = async () => {
    const res = await get('/record/')
    if (res.code == 200) {
        console.log(res.data);
        talkRoleStore.setTalkHistory(res.data)
    } else {
        isDialog.value = true
        DialogText.value = "获取失败"
        setTimeout(() => {
            isDialog.value = false
        }, 1000)
    }
}

const handleHistory = async (id: string | undefined) => {
    const res = await get('/information/', { id: id })
    if (res.data && id) {
        talkRoleStore.setMessages(res.data)
        title.value = talkRoleStore.messages[0].message
        localStorage.setItem('chat', id)
    }
}

// 图片预览
const previewImage = ref('')
function onUploadChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (files) {
        uploadImage.value = files[0]
    }
    preview()
}

const preview = () => {
    if (uploadImage.value) {
        previewImage.value = URL.createObjectURL(uploadImage.value)
    }
}

</script>

<style lang="scss" scoped>
.chat_header {
    position: fixed;
    width: 100%;
    height: 4rem;
    //颜色由淡黑色渐变为白色后消失
    background: linear-gradient(rgba(0, 0, 0, 0.6), white);
    display: flex;
    align-items: center;
    justify-content: center;

    .title {
        max-width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.9rem;
        font-weight: 600;
        color: black;

        //居中
        &:hover {
            cursor: pointer;
        }
    }

    .title-box {
        height: 3rem;
        width: 5rem;
        background-color: black;
        border-radius: 10px;
        box-shadow: 2px 10px 10px #e0e0e0;
        position: absolute;
        bottom: -2rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        font-weight: 600;
        font-size: smaller;
        color: white;

        .box:hover {
            cursor: pointer;
        }
    }

    .iconfont {
        position: absolute;

        &:hover {
            cursor: pointer;
        }
    }

    .home {
        left: 0;
        margin: 5px;
        font-size: 1.5rem;
    }

    .history {
        right: 0;
        margin: 5px;
        font-size: 1.4rem;
    }
}

.chat {
    width: 60vw;
    padding-top: 4rem;
    margin: 0 auto;
    padding-bottom: 4rem;

    .user {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;

        .message {
            background-color: black;
            padding: 8px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            max-width: 70%;
        }

        .head {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            background-color: black;
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
            margin-left: 10px;
        }
    }

    .role {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;

        .message {
            background-color: #e0e0e0;
            padding: 8px;
            border-radius: 10px;
            color: black;
            font-weight: 600;
            font-size: 0.9rem;
            max-width: 70%;
        }

        .head {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            background-color: #e0e0e0;
            color: black;
            font-weight: 600;
            font-size: 0.9rem;
            margin-right: 10px;
        }
    }
}

.chat_input {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
}

.history-box {
    //透明遮罩
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    justify-content: center;

    .history-content {
        //阻止默认事件
        // pointer-events: none;
        width: 50%;
        height: 100%;
        // background-color: white;
        border-radius: 10px;
        overflow-y: auto;
        padding: 10px;
        box-sizing: border-box;

        //隐藏滚动条
        &::-webkit-scrollbar {
            display: none;
        }

        .iconfont {
            color: white;
            font-size: x-large;

            &:hover {
                cursor: pointer;
            }
        }

        .history-item {
            position: relative;
            box-sizing: border-box;
            height: 3.5rem;
            padding: 10px;
            width: 100%;
            background-color: black;
            border-radius: 10px;
            margin-top: 20px;
            color: white;
            display: flex;
            align-items: center;
            font-weight: 600;

            &:hover {
                cursor: pointer;
                background-color: #333;
            }

            .date {
                position: absolute;
                bottom: 0;
                font-size: small;
                transform: scale(0.9);
                right: 10px;
                // background-color: aqua;
            }
        }
    }
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    /* 白色背景 */
    width: 400px;
    /* 调整弹框宽度 */
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 1;
    /* 弹框位于最上层 */
    text-align: center;

    /* 图片选择框样式 */
    input[type="file"] {
        display: none;
        /* 隐藏原始文件输入框 */
    }

    .custom-file-upload {
        border: 2px solid #ccc;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
        background-color: #007bff;
        /* 蓝色按钮 */
        color: #fff;
        /* 白色文本 */
        border-radius: 5px;
    }

    .button {
        margin: 10px;
        padding: 10px 20px;
        background-color: black;
        /* 蓝色按钮 */
        color: #fff;
        /* 白色文本 */
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .cancel-button {
        background-color: #ccc;
        /* 灰色按钮 */
    }
}


//移动端
@media screen and (max-width: 768px) {
    .chat {
        width: 90%;

        .message {
            max-width: 39vw;
        }
    }

    .history-box {
        .history-content {
            width: 80%;
        }
    }

}
</style>