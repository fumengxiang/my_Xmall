import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: false, // 用户是否登录
    userInfo: null, // 用户信息
    cartList: [], // 购物车中的商品
    showCart: false
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
