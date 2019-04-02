import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/login.vue'
import Home from '@/views/home.vue'
import Index from '@/views/index.vue'
import Users from '@/views/users/users.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // 登录路由 （/login 路由对应的组件会替换 App.vue 中的 <router-view />）
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    // 首页路由
    {
      name: 'home',
      path: '/',
      component: Home,
      // 给 Home 组件设置子路由（子路由对应的子组件会替换 父组件Home中的 <router-view />）
      children: [
        {
          name: 'index',
          path: 'index',
          component: Index
        },
        // 用户列表路由
        {
          name: 'users',
          path: 'users',
          component: Users
        }
      ]
    }
  ]
})
