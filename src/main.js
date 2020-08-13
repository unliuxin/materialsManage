import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

axios.defaults.baseURL = "https://www.zykhome.club/api/"
    // axios拦截请求
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
        //为请求对象添加token验证的Authorization
    return config
})
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')