import { createApp } from 'vue'
import '@/style.scss'
import { createPinia } from "pinia"
import App from '@/App.vue'

//引入路由
import { routers } from '@/routers'

//引入适配移动端的js
import { Adaptation } from "@/utils/adaptation.ts";

//设置rem基准值，适配移动端
Adaptation()

const app = createApp(App)
const pinia = createPinia()

app.use(routers)
app.use(pinia)

app.mount('#app')
