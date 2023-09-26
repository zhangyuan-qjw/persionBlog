import axios from 'axios';


//导入开发环境配置

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL + 'blog/',
    //超时时间设置为五分钟
    timeout: 5 * 60 * 1000,
})


//请求接口
export const get = async (url: string, param?: any) => {
    const response = await api.get(url, { params: param });
    return response.data;
}

export const post = async (url: string, data: any, header?: any) => {
    const response = await api.post(url, data, header);
    return response.data;
}