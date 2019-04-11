// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入 elementUI 样式
// import 'element-ui/lib/theme-chalk/index.css' // import css注释掉，缩减app(css)体积，因为在index.html中已经用cdn加载过这个css样式了
// 引入公共样式
import '@/assets/css/index.css'

// import 插件对象，这些不能注释，这代表的是从cdn下载后的包中，导入插件到项目中
// 引入 elementUI 对象(但是：当vue是从cdn和element都是cdn引入的话，element可以不用import引入和Vue.use注册，因为element是基于vue封装的)
// import Element from 'element-ui'
// 引入封装的 axios 插件
import axios from '@/assets/js/myaxios.js'
// 引入全局面包屑组件
import MybreadCrumb from '@/components/breadcrumb.vue'
// 引入moment
import moment from 'moment'

// 注意，所有的 import 必须放在前面，import 语句之前不能有其他的代码

// 全局注册 element ，将来任何位置都可以使用 element 组件
// Vue.use(Element)(但是：当vue是从cdn和element都是cdn引入的话，element可以不用import引入和Vue.use注册，因为element是基于vue封装的)
// 全局注册 axios
Vue.use(axios)
// 注册全局面包屑组件，格式：Vue.component('组件名' , 组件)
Vue.component(MybreadCrumb.name, MybreadCrumb)
// 注册全局过滤器(时间格式化)
Vue.filter('myTime', function (time) {
  return moment(time).format('YYYY-MM-DD hh:mm:ss') // 使用 moment 格式化时间
})
// 注册q全局过滤器(人民币格式化)
Vue.filter('myRMB', function (rmb) {
  return rmb.toFixed(2) + ' ¥'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
