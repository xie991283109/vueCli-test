import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'


/****** 全局注册axios ******/
import axios from 'axios';
Vue.prototype.axios = axios;


/****** 全局注册vux组件 ******/
import {TransferDom, Cell, Toast, Alert, Confirm, Group, CellBox, Actionsheet} from 'vux';
Vue.directive('transfer-dom', TransferDom);
Vue.component('cell', Cell);
Vue.component('toast', Toast);
Vue.component('alert', Alert);
Vue.component('confirm', Confirm);
Vue.component('group', Group);
Vue.component('cell-box', CellBox);
Vue.component('actionsheet', Actionsheet);


/****** 全局处理错误提示、数据加载 ******/
import {ToastPlugin, LoadingPlugin} from 'vux'
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);


Vue.config.productionTip = false;


const app = new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
});

export default app;
