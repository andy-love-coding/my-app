import Axios from 'axios'
var myPlugin = {}
myPlugin.install = function (vue) {
  // 创建axios实例
  var instance = Axios.create({
    baseURL: 'http://192.168.10.10:8888/api/private/v1/'
  })
  // axios 拦截器：可用于在请求发送之前，做一些事情，如加个请求头 token
  instance.interceptors.request.use(function (config) {
    // 请求非登录页面时，带上token
    if (config.url !== 'login') {
      // instance.defaults.headers.Authorization = window.localStorage.getItem('token')
      // 上面的 instance.defaults 是给全局的 axios 请求带上token，这显然不对，我们要求是给除了 login 以外的请求带上 token
      // 因此需要给每次的请求单独加上 token，每次的请求对象，就是 config ，在 config 上加 token 就好
      config.headers.Authorization = window.localStorage.getItem('token')
    }
    return config
  })
  vue.prototype.$http = instance
}
// 暴露
export default myPlugin
