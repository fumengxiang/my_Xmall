import Vue from 'vue';
import VueRouter from 'vue-router';

// import Index from '@/views/Index.vue';
// import Login from '@/views/Login'
// import Home from '@/views/Home'
// import Goods from '@/views/Goods'
// import Thanks from '@/views/Thanks'
// import GoodsDetails from '@/views/GoodsDetails'
// import User from '@/views/User';

// 路由的懒加载
const Index = () => import('@/views/Index')
const Login = () => import('@/views/Login')
const Home = () => import('@/views/Home')
const Goods = () => import('@/views/Goods')
const Thanks = () => import('@/views/Thanks')
const GoodsDetails = () => import('@/views/GoodsDetails')
const User = () => import('@/views/User')

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
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    // 表示跳转到/user是需要登录
    meta: {
      auth: true
    }
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
