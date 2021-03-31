import Vue from 'vue';
import Vuex from 'vuex';
import {setStore, getStore} from '@/utils/storage'

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
    },
    ADDCART(state, {productId, salePrice, productName, productImageBig, productNum = 1}) {
      let cart = state.cartList
      let goods = {
        productId,
        salePrice,
        productName,
        productImageBig
      }
      let flag = true
      if (cart.length) {
        cart.forEach(item => {
          if (item.productId === productId) {
            if (item.productNum >= 0) {
              flag = false
              item.productNum += productNum
            }
          }
        })
      }
      if (!cart.length || flag) {
        goods.productNum = productNum
        cart.push(goods)
      }
      state.cartList = cart
      setStore('buyCart', cart)
    },
    INITBUYCART(state) {
      // 如果没有本地cookie该如何存储数据
      let initCart = getStore('buyCart')
      if (initCart) {
        state.cartList = JSON.parse(initCart)
      }
    }
  },
  actions: {
  },
  modules: {
  },
});
