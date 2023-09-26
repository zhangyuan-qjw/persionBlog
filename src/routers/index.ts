import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    { path: '/', component: () => import('@/views/home/homeView.vue') },
    { path: '/chat', component: () => import('@/views/home/chatView.vue') },
    { path: '/baiHuaAddArticle', component: () => import('@/components/articleEdite.vue') },
    {
        path: '/albinism',
        component: () => import('@/views/albinism/albinismView.vue'),
        redirect: '/albinism/baiHua',
        children: [
            { path: 'baiHua', component: () => import("@/views/albinism/components/BaiHuaView.vue") },
            { path: 'diary', component: () => import("@/views/albinism/components/DiaryView.vue") },
            { path: 'picture', component: () => import("@/views/albinism/components/PictureView.vue") },
            { path: 'philosophy', component: () => import("@/views/albinism/components/philosophyView.vue") },
            { path: 'tale', component: () => import("@/views/albinism/components/taleView.vue") },
        ]
    },

    { path: '/:pathMatch(.*)*', component: () => import('@/views/notFound/404.vue') },
]

export const routers = createRouter({
    history: createWebHistory(),
    routes
})