<template>
    <div class="add-card">
        <div class="card" v-for="item in switches" :key="item.id">
            <span>{{ item.role }}</span>
            <div class="toggle-switch" :class="item.checked ? 'isBlack' : ''" @click="toggleSwitch(item)" :id="item.id">
                <input type="checkbox" :checked="item.checked">
                <span class="label" :id="item.id"></span>
            </div>
        </div>
        <div class="article-card" v-show="isChat">
            <div class="chat-container">
                <div class="history" :style="{ height: height }">
                    <div class="history_text">历史记录</div>
                    <div class="history_item" v-for="history in histories" :key="history.id"
                        @click="getMessages(history.chat_id)">
                        <div class="history_title">{{ history.now_role }}</div>
                        <span>{{ history.created_at }}</span>
                        <i class="iconfont icon-shanchu" title="删除"></i>
                    </div>
                </div>
                <div class="chat" ref="chatBox">
                    <div v-for="(message, index) in messages" :key="index"
                        :class="['message', message.incoming ? 'incoming' : 'outgoing']">
                        <div :class="message.incoming ? 'role' : 'me'">{{ message.role }}</div>
                        <div class="message-text">{{ message.text }}</div>
                    </div>
                </div>
                <div class="icon">
                    <i class="iconfont icon-qingkongbeifen" title="清空" @click="newSession"></i>
                    <i class="iconfont icon-lishijilu1" title="历史记录" @click="getHistory"></i>
                    <i class="iconfont icon-baocun" title="长久保存当前会话" @click="saveData"></i>
                </div>
                <div class="loading" v-show="!isWhite">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
                <div class="user-input">
                    <textarea placeholder="聊天框..." @keydown.enter.prevent="onEnter" v-model="my"></textarea>
                    <button @click="onEnter()">Send</button>
                </div>
            </div>
        </div>
    </div>
    <GlobalDialog :Dialog="isDialog">{{ DialogText }}</GlobalDialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import { post, get } from '@/utils/api';
import GlobalDialog from '@/components/GlobalDialog.vue';

const switches = reactive([
    { id: "switch1", checked: false, role: "白化" },
    { id: "switch2", checked: false, role: "章远" },
    { id: "switch3", checked: false, role: "陈羽昂" },
    { id: "switch4", checked: false, role: "你" },
    { id: "switch5", checked: false, role: "我" },
])

const isDialog = ref(false)
const DialogText = ref('')
const height = ref('0rem')

const isChat = ref(false)

//获取当前年，月，日，时，分，秒
const date = new Date()
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()

const messages = reactive([
    { role: '白化', text: `今天是${year}年${month}月${day}号，你好！`, incoming: true },
    // 初始消息可以根据需要设置
])






const histories = ref<any>([])

//查看历史记录
const history = () => {
    if (height.value === '0rem') {
        height.value = '14rem'
    } else {
        height.value = '0rem'
    }
}

//页面初始化判断
onMounted(async () => {
    const session = localStorage.getItem('session')
    const role = localStorage.getItem('role')

    if (role) {
        isChat.value = true
    }

    if (session) {
        //获取当前session的聊天记录     
        const res_session = await get("messages/", {
            session
        })
        if (res_session.code === 200) {
            const messages_session = res_session.data.messages
            messages_session.forEach((item: any) => {
                messages.push({ role: item.user, text: item.content, incoming: item.user === "邱" ? false : true })
            })
            await nextTick()
            scrollToBottom();
        } else {
            localStorage.removeItem('session')
            isDialog.value = true
            DialogText.value = res_session.data
            setTimeout(() => {
                isDialog.value = false
            }, 1000)
        }
    }
    switches.forEach((item) => {
        item.checked = false
        if (item.role === role) {
            item.checked = true
        }
    })
})

//保存数据
const saveData = async () => {
    const session = localStorage.getItem('session')
    const role = localStorage.getItem('role')
    if (!session || !role) return
    const res = await post("save/", {
        session,
        role,
    })
    console.log(res);
}

//获取聊天记录
const getMessages = async (session: number) => {
    const res = await get("messages/", {
        session
    })
    if (res.code === 200) {
        const messages_session = res.data
        height.value = '0rem'
        console.log(messages_session);
    }
}


//获取历史记录
const getHistory = async () => {
    history()
    if (height.value === '0rem') return
    const many_session = await get("sessions/")
    console.log(many_session);

    if (many_session.code === 200) {
        const sessions = many_session.data
        histories.value = sessions
    }
    console.log(histories.value);
}

//新建会话
const newSession = () => {
    if (!localStorage.getItem('session')) return
    localStorage.removeItem('session')
    //去掉messages中除第一个外的所有数据
    messages.splice(1)
    // console.log(messages);

}

//消息框自动滚动到底部
const chatBox = ref(null)
function scrollToBottom() {
    if (!chatBox.value) return
    const chatBoxDom = chatBox.value as HTMLElement
    chatBoxDom.scrollTop = chatBoxDom.scrollHeight
}

const toggleSwitch = (target: any) => {
    //判断当前标签是否选中
    if (target.checked) {
        target.checked = false
        localStorage.removeItem('role')
        isChat.value = false
        return
    }
    switches.forEach((item) => {
        item.checked = false
        if (item.id === target.id) {
            isChat.value = true
            localStorage.setItem('role', item.role)
            item.checked = !item.checked
        }
    })
}

//聊天代码如下
const my = ref('')
const isWhite = ref(true)

async function onEnter(event?: KeyboardEvent) {
    if (event) {
        event.preventDefault();
    }
    const now_role = localStorage.getItem('role')
    if (my.value && now_role && isWhite.value) {
        const text = my.value
        isWhite.value = false
        messages.push({ role: '邱', text: my.value, incoming: false })
        await nextTick()
        scrollToBottom();
        my.value = ''
        const session = localStorage.getItem('session')
        if (session) {
            const res = await talk(now_role, text, session)
            if (res.data) {
                messages.push({ role: now_role, text: res.data.content, incoming: true })
            }
        }
        else {
            const res = await talk(now_role, text)
            if (res.data) {
                messages.push({ role: now_role, text: res.data.content, incoming: true })
                localStorage.setItem('session', res.data.session)
            }
        }
        // 等待 DOM 更新完成后再执行
        isWhite.value = true
        await nextTick()
        scrollToBottom();
    }
}

//新建会话

//调用talk接口
const talk = async (role: string, message: string, session?: string) => {

    const res = await post('/talk/', {
        role,
        message,
        session,
    })
    return res
}

</script>


<style lang="scss" scoped>
.add-card {
    position: absolute;
    height: 3rem;
    width: 18rem;
    top: 4rem;
    left: 1rem;
    border-radius: 5px;
    box-shadow: 0 0 10px #ccc;
    display: flex;

    .card {
        width: 20%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        //均匀分布
        justify-content: space-evenly;
        font-weight: 600;
        font-size: small;

        .toggle-switch {
            position: relative;
            width: 40px;
            height: 20px;
            background-color: rgba(255, 255, 255, 0.5);
            box-shadow: 0 0 10px #ccc;
            border: #ccc 1px solid;
            border-radius: 10px;
            cursor: pointer;
        }

        .toggle-switch input {
            display: none;
        }

        .toggle-switch .label {
            position: absolute;
            top: 1px;
            left: 1px;
            width: 18px;
            height: 18px;
            background-color: black;
            border-radius: 50%;
            transition: transform 0.3s ease;
        }

        .toggle-switch input:checked+.label {
            transform: translateX(20px);
            background-color: white;
        }

    }
}

.isBlack {
    background-color: black !important;
}

.article-card {
    position: absolute;
    margin-top: 3.5rem;
    padding: 0;
    height: 20rem;
    width: 18rem;
    border-radius: 5px;
    box-shadow: inset 0 0 10px #ccc;
    background-color: white;

    .chat-container {
        height: 100%;
        border-radius: 10px;
        overflow: hidden;

        .history {
            // visibility: hidden;
            position: absolute;
            border-radius: 5px;
            z-index: 1;
            width: 100%;
            height: 0rem;
            background-color: white;
            box-shadow: 0 0 10px #ccc;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: scroll;

            &::-webkit-scrollbar {
                display: none;
            }

            font-size: small;
            transition: height 0.3s ease-in-out;

            .history_text {
                width: 96%;
                height: 4rem;
                color: black;
                display: flex;
                flex-shrink: 0;
                justify-content: center;
                height: 2rem;
                font-size: medium;
                font-weight: 600;
            }

            .history_item {
                width: 96%;
                height: 3rem;
                color: black;
                display: flex;
                flex-direction: column;
                //子元素不能被压缩
                flex-shrink: 0;
                //上出现白色的边
                border-top: 1px solid black;
                position: relative;

                &:hover {
                    background-color: #f6f6f6;
                    cursor: pointer;

                    //兄弟元素
                    .iconfont {
                        color: black;
                    }
                }

                .history_title {
                    margin-bottom: 5px;
                    font-weight: 600;
                }

                span {
                    font-size: small;
                    transform: scale(0.9);
                    //文本溢出显示省略号
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-left: -15px;
                }

                .iconfont {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    font-size: medium;
                    color: #ccc;
                    transform: scale(0.8);

                    &:hover {
                        color: red;
                    }
                }
            }

        }

        .chat {
            padding: 20px;
            overflow-y: scroll;
            height: 68%;
            display: flex;
            flex-direction: column;
            scroll-behavior: smooth;

            &::-webkit-scrollbar {
                display: none;
            }

            .message {
                margin-bottom: 20px;
                padding: 7px;
                border-radius: 8px;
                max-width: 100%;
                position: relative;
                font-size: medium;

                &.incoming {
                    background-color: #e0e0e0;
                    align-self: flex-start;
                    max-width: 80%;

                    .role {
                        position: absolute;
                        top: -20px;
                        font-weight: 600;
                        font-size: xx-small;
                        width: 45px;
                        left: 0;
                        transform: scale(0.8);
                    }
                }

                &.outgoing {
                    background-color: black;
                    color: white;
                    align-self: flex-end;
                    position: relative;
                    max-width: 80%;

                    .me {
                        position: absolute;
                        top: -20px;
                        right: 0;
                        font-weight: 600;
                        color: black;
                        font-size: xx-small;
                        transform: scale(0.8);
                    }
                }
            }
        }

        .icon {
            position: absolute;
            bottom: 22%;
            right: 0;

            .iconfont {
                // font-size: 1.5rem;
                margin: 0 0.3rem;
                cursor: pointer;
            }
        }

        .loading {
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: 23%;
            margin-left: 5px;

            .dot {
                width: 5px;
                height: 5px;
                margin: 0 2.5px;
                border-radius: 50%;
                background-color: #000;
                animation: dot-pulse 0.8s ease-in-out infinite;

                &:nth-child(1) {
                    animation-delay: 0s;
                }

                &:nth-child(2) {
                    animation-delay: 0.2s;
                }

                &:nth-child(3) {
                    animation-delay: 0.4s;
                }
            }
        }

        @keyframes dot-pulse {
            from {
                opacity: 1;
                transform: scale(1);
            }

            to {
                opacity: 0.2;
                transform: scale(0.5);
            }
        }


        .user-input {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            border-top: 1px solid #ccc;

            textarea {
                appearance: none;
                border: none;
                resize: none;
                outline: none;
                overflow: hidden;

                &::-webkit-scrollbar {
                    display: none;
                }

                flex-grow: 1;
                padding: 8px;
                border-radius: 5px;
                font-weight: 600;

            }

            button {
                background-color: black;
                color: white;
                border: none;
                border-radius: 5px;
                padding: 8px 12px;
                cursor: pointer;
            }
        }
    }

}

//移动端
@media screen and (max-width: 768px) {
    .add-card {
        z-index: -1;
        position: relative;
        top: 6.5rem;
        //居中
        left: 50%;
        transform: translateX(-50%);
        width: 90%;

        .article-card {
            width: 100%;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>