// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入 elementUI 对象
import Element from 'element-ui'
// 引入 elementUI 样式
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import '@/assets/css/index.css'
// 引入封装的 axios 插件
import axios from '@/assets/js/myaxios'

// 注意，所有的 import 必须放在前面，import 语句之前不能有其他的代码

// 全局注册 element ，将来任何位置都可以使用 element 组件
Vue.use(Element)
// 注册 axios
Vue.use(axios)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
