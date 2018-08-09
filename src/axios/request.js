import Vue from "vue";
import axios from "axios";
import qs from "qs";
import app from "../main.js";


const baseUrl = document.domain === 'localhost' || document.domain === 'yibaotest.runningdoctor.cn'
    ? 'http://testapi.runningdoctor.cn/shebao-api'
    : 'http://testapi.runningdoctor.cn/shebao-api';


/****** 创建axios实例 ******/
const service = axios.create({
    baseURL: baseUrl,  // api的base_url
    timeout: 5000  // 请求超时时间
});


/****** request拦截器 ******/
service.interceptors.request.use(config => {
    config.method === 'post'
        ? config.data = qs.stringify({...config.data})
        : config.params = {...config.params};
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    return config;
}, error => {
    app.$vux.toast.show({
        type: 'warn',
        text: error
    });
    Promise.reject(error)
});


/****** respone拦截器 ******/
service.interceptors.response.use(
    response => {
        // console.log('response');
        // console.log(response);
        // console.log(JSON.stringify(response));
        if (response.data.result === 'TRUE') {
            return response.data;
        } else {
            app.$vux.toast.show({  //常规错误处理
                type: 'warn',
                text: '网络异常，请重试'
            });
        }
    },
    error => {
        console.log('error');
        console.log(error);
        console.log(JSON.stringify(error));
        let text = JSON.parse(JSON.stringify(error)).response.status === 404
            ? '404'
            : '网络异常，请重试';
        app.$vux.toast.show({
            type: 'warn',
            text: text
        });
        return Promise.reject(error)
    }
);
export default service;
