import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入字体图标库
// 全局导入样式表
import './assets/css/global.css'
// 引入插件 vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
// 引入插件 vue-quill-editor 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入 NProgress 包对应的js和css
import NProgress from 'nprogress'

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use((config) => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

// 注册全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

Vue.use(VueQuillEditor /* { default global options } */)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
