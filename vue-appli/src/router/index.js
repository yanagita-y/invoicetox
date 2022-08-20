// Vue3への変更に伴いコメントアウト ここから
/*
import Vue from 'vue'
import VueRouter from 'vue-router'
*/
// Vue3への変更に伴いコメントアウト ここまで
// Vue3への変更に伴い追加 ここから
import { createRouter, createWebHistory } from 'vue-router'
// Vue3への変更に伴い追加 ここまで
// import HomeView from '../views/HomeView.vue'
// Vue3への変更に伴いコメントアウト ここから
// import Vuex from 'vuex'
// Vue3への変更に伴いコメントアウト ここまで
import store from '@/store/index';

// Vue3への変更に伴いコメントアウト ここから
/*
Vue.use(Vuex)
Vue.use(VueRouter)
*/
// Vue3への変更に伴いコメントアウト ここまで

const routes = [
  {
    path: '/:id/invoice/add',
    name: 'company_invoice_add',
    component: () => import('../views/NewInvoiceView.vue')
  },
  {
    path: '/invoice/add',
    name: 'invoice_add',
    component: () => import('../views/NewInvoiceView.vue')
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('../views/ListCompanyView.vue')
  },
  {
    path: '/company/:id',
    name: 'company',
    component: () => import('../views/ListInvoiceView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    beforeEnter: (to, from, next) => {
      if(!store.getters.user){
        console.log(store.getters.user);
        next('/');
      }
      next();
    },
    component: () => import('../views/DashboardView.vue')
  }
]

// Vue3への変更に伴いコメントアウト ここから
/*
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
*/
// Vue3への変更に伴い追加 ここから
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// Vue3への変更に伴い追加 ここまで

export default router
