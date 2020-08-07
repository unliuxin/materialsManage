import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/common/login/Login.vue'
import Home from '../views/home/Home.vue'
import Welcome from '../views/home/homeChild/Welcome.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            component: Welcome
        }, ]
    }
]



const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//为路由对象加上导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        //从sessionStorage获取token
        const tokenStr = window.sessionStorage.getItem('token')
        if (!tokenStr) {
            next('/login')
        } else {
            next()
        }
    }
})
export default router