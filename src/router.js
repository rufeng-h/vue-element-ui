/*
 * @Author: Pluto
 * @Date: 2021-11-27 18:00
 * @Description:
 */

import VueRouter from "vue-router"
import Vue from 'vue'

Vue.use(VueRouter)

const router = new VueRouter({
  // mode: 'history',
  routes: [
    {
      name: 'login',
      path: "/login",
      component: () => import('./components/Login')
    },
    {
      name: 'home',
      path: '/home',
      redirect: { name: 'welcome' },
      component: () => import('./components/Home'),
      children: [
        {
          name: 'welcome',
          path: '/welcome',
          component: () => import('./components/Welcome')
        },
        {
          name: 'users',
          path: '/users',
          component: () => import('./components/user/Users')
        },
        {
          name: 'roles',
          path: '/roles',
          component: () => import('./components/authority/Roles')
        },
        {
          name: 'permissions',
          path: '/permissions',
          component: () => import('./components/authority/Permissons')
        },
        {
          name: 'goodsCategories',
          path: '/goodsCategories',
          component: () => import('./components/goods/Category')
        },
        {
          name: 'goodsCategoryAttr',
          path: '/goodsCategoryAttr',
          component: () => import('./components/goods/CategoryAttr')
        }
      ],
    },
    {
      name: 'index',
      path: '/index',
      alias: ['', '/'],
      component: () => import('./components/Index')
    }
  ],
}
)

export default router
