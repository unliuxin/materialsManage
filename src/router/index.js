import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/common/login/Login.vue'
import Home from '../views/home/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: Login
    },
    {
        path: '/home',
        component: Home
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router