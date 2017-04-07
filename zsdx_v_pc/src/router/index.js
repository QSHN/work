import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import ZsdxIndex from '@/components/page/index/zsdx_index'
import Login from '@/components/page/login/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      name: 'ZsdxIndex',
      component: ZsdxIndex
    }
  ]
})
