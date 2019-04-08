import Vue from 'vue'
import Router from 'vue-router'

// 常规路由加载
// import Login from '@/views/login/login.vue'
// import Home from '@/views/home.vue'
// import Index from '@/views/index.vue'
// import Users from '@/views/users/users.vue'
// import Rights from '@/views/rights/rights.vue'
// import Roles from '@/views/rights/roles.vue'
// import Categories from '@/views/goods/categories.vue'
// import Goods from '@/views/goods/goods.vue'
// import GoodsAdd from '@/views/goods/goodsAdd.vue'
// import Params from '@/views/goods/params'
// import Orders from '@/views/orders/orders'
// import Reports from '@/views/reports/reports.vue'

// 首屏优化：路由懒加载
const Login = () => import('@/views/login/login.vue')
const Home = () => import('@/views/home.vue')
const Index = () => import('@/views/index.vue')
const Users = () => import('@/views/users/users.vue')
const Rights = () => import('@/views/rights/rights.vue')
const Roles = () => import('@/views/rights/roles.vue')
const Categories = () => import('@/views/goods/categories.vue')
const Goods = () => import('@/views/goods/goods.vue')
const GoodsAdd = () => import('@/views/goods/goodsAdd.vue')
const Params = () => import('@/views/goods/params')
const Orders = () => import('@/views/orders/orders')
const Reports = () => import('@/views/reports/reports.vue')

Vue.use(Router)

var router = new Router({
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
      children: [{
          name: 'index',
          path: 'index',
          component: Index
        },
        // 用户列表路由
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        // 权限列表路由
        {
          name: 'rights',
          path: 'rights',
          component: Rights
        },
        // 角色列表路由
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        },
        // 商品分类列表路由
        {
          name: 'categories',
          path: 'categories',
          component: Categories
        },
        // 商品列表路由
        {
          name: 'goods',
          path: 'goods',
          component: Goods
        },
        // 新增商品路由
        {
          name: 'goodsAdd',
          path: 'goods/add',
          component: GoodsAdd
        },
        // 商品参数路由
        {
          name: 'params',
          path: 'params',
          component: Params
        },
        // 订单列表路由
        {
          name: 'orders',
          path: 'orders',
          component: Orders
        },
        // 数据报表路由
        {
          name: 'reports',
          path: 'reports',
          component: Reports
        }
      ]
    }
  ]
})

// 使用导航守卫（路由守卫）作 登录判断
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    // 如果要跳转的路由不是登录页
    let token = window.localStorage.getItem('token')
    if (token) {
      // 如果已登录，则放行
      next()
    } else {
      // 如果未登录，则跳转到 登录页
      // router.app就是Vue对象，可以打印看看
      router.app.$message.error('对不起，您还没有登录！！！')
      setTimeout(function () {
        router.push({
          name: 'login'
        })
      }, 1000)
    }
  } else {
    // 如果跳转的登录页则直接放行
    next()
  }
})

export default router
