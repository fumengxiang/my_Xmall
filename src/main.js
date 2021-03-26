import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
// 挂载axios到Vue原型中，以便所有的组件都可以以this.$http的形式访问axios
import axios from "axios";
Vue.prototype.$http = axios

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
