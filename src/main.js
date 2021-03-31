import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
import {getStore} from '@/utils/storage'
// 挂载axios到Vue原型中，以便所有的组件都可以以this.$http的形式访问axios
import axios from "axios";
Vue.prototype.$http = axios
// 请求拦截，给每个请求头都加上一个token字段
axios.interceptors.request.use(config => {
  // 从请求头中获取token
  const token = getStore('token')
  if (token) {
    // 能够获取表示用户已经登录
    config.headers.common['Authorization'] = token
  }
  return config
}, err => {
  return Promise.reject(err)
})
Vue.config.productionTip = false;

// 导航守卫, 每一个导航都做登录认证
router.beforeEach((to, from, next) => {
  // 跳转每个路由之前都验证是否登录，然后将跳转到登录界面
  axios.post('/api/validate', {}).then(res => {
    let data = res.data
    // 获取的返回数据，判断用户是否登录此时为未登录
    if (data.state !== 1) {
      if (to.matched.some(recode => recode.meta.auth)) {
        // 为真时表示用户未登录，需要跳转到登录界面
        next({
          path:'/login',
          query: {
            redirect: to.fullPath
          }
        })
      } else {
        next()
      }
    } else {
      store.commit('ISLOGIN', data)
    }
  }).catch(err => {
    console.log(err);
  })
  next()
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
