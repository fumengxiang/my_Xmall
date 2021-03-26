import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '@/views/Index.vue';
import Login from '@/views/Login'
import Home from '@/views/Home'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
    name: 'home',
    component: Index,
    children: [
      {
        path: 'home',
        component: Home
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
