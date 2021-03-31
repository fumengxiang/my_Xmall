import Vue from 'vue';
import Vuex from 'vuex';
import {setStore} from '@/utils/storage'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: false, // 用户是否登录
    userInfo: null, // 用户信息
    cartList: [], // 购物车中的商品
    showCart: false // 是否展示购物车
  },
  mutations: {
    SHOWCART(state, {showCart}) {
      state.showCart = showCart
    },
    ISLOGIN(state, info) {
      state.userInfo = info
      state.login = true
      setStore('userInfo', info)
    }
  },
  actions: {
  },
  modules: {
  },
});
