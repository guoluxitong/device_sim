import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'
Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    redirect: '/login',
    hidden: true
  },
  {path: '/login',component: () => import('../views/login/index'),hidden: true},
  {
    path:'/home' ,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('../views/home/index'),
        meta: { title: '首页', noCache: true}
      }
    ]
  },
  {
    path:'/home' ,
    component: Layout,
    children: [
      {
        path: 'device',
        component: () => import('../views/device/index'),
        meta: { title: '设备管理', noCache: true}
      }
    ]
  },
  /*{
    path:'/home' ,
    component: Layout,
    children: [
      {
        path: 'simcore',
        component: () => import('../views/simcore/index'),
        meta: { title: 'sim卡', noCache: true}
      }
    ]
  },*/
  {
    path:'/home' ,
    component: Layout,
    children: [
      {
        path: 'simcoremanagement',
        component: () => import('../views/simcoremanagement/index'),
        meta: { title: 'sim卡管理', noCache: true}
      }
    ]
  },
  {
    path:'/home' ,
    component: Layout,
    children: [
      {
        path: 'updateHistory',
        component: () => import('../views/updateHistory/index'),
        meta: { title: '状态变更管理', noCache: true}
      }
    ]
  },
  // {
  //   path:'/home' ,
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'simpayment',
  //       component: () => import('../views/simpayment/index'),
  //       meta: { title: '微信sim卡充值管理', noCache: true}
  //     }
  //   ]
  // }
  // ,
  {
    path:'/home' ,
    component: Layout,
    children: [
      {
        path: 'recharge',
        component: () => import('../views/rechargemanagement/index'),
        meta: { title: 'sim卡在线管理', noCache: true}
      }
    ]
  }
]
export default new Router({
  mode: 'history',
  base:__dirname,
  routes:constantRouterMap
})
