import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import ZsdxIndex from '@/components/page/index/zsdx_index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/' || '/index',
      name: 'ZsdxIndex',
      component: ZsdxIndex
    }
  ]
})
