import { defineStore } from 'pinia'

//类型声明
interface albinism_type {
    id: number,
    title: string,
    content: string,
    article_type: string,
    pub_time: string,
}

export const useStore = defineStore("main", {
    state: () => ({
        albinism_artilces: ([] as unknown) as albinism_type[],
        albinism_article: ({} as unknown) as albinism_type, //当前浏览的文章
        albinism_article_page: 1,
    }),
    actions: {
        setAlbinismArticles(articles: any) {
            this.albinism_artilces.push(...articles)
        },
        setAlbinismArticle(article: any) {
            this.albinism_article = article
        },
        addAlbinismArticlePage(number: number) {
            this.albinism_article_page += number
        }
    },
    getters: {
        //格式化时间
        formatTime: () => (time: string) => {
            // 创建一个Date对象
            var timestamp = new Date(time);

            // 获取年、月、日、小时、分钟和秒
            var year = timestamp.getFullYear();
            var month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
            var day = ("0" + timestamp.getDate()).slice(-2);
            var hour = ("0" + timestamp.getHours()).slice(-2);
            var minute = ("0" + timestamp.getMinutes()).slice(-2);
            var second = ("0" + timestamp.getSeconds()).slice(-2);

            // 格式化为所需的字符串表示形式
            var formattedTimestamp = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            return formattedTimestamp
        },
        //根据页码获取文章列表
        getAlbinismArticlesByPage: (state: any) => (page: number) => {
            let articles = state.albinism_artilces
            let start = (page - 1) * 10
            let end = page * 10
            return articles.slice(start, end)
        }
    }
})