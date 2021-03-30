import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '@/views/Index.vue';
import Login from '@/views/Login'
import Home from '@/views/Home'
import Goods from '@/views/Goods'
import Thanks from '@/views/Thanks'
import GoodsDetails from '@/views/GoodsDetails'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
    name: 'home',
    component: Index,
    // 子路由的路径不用写分号
    children: [
      {
        path: '/home',
        component: Home
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/thanks',
        component: Thanks
      },
      {
        path: '/goodsDetails',
        name: 'goodsDetails',
        component: GoodsDetails
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
