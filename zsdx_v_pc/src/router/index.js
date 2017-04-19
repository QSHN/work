import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import ZsdxIndex from '@/components/page/index/zsdx_index'
import Login from '@/components/page/login/login'
import Register from '../components/page/register/index.vue'
import RegisterPhone from '../components/page/register/phone.vue'
import RegisterMail from '../components/page/register/mail.vue'

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
      path: '/register',
      name: 'Register',
      component: Register,
      redirect: '/register/phone',
      children: [
        { path: 'phone', name: 'RegisterPhone', component: RegisterPhone },
        { path: 'mail', name: 'RegisterMail', component: RegisterMail }
      ]
    },
    {
      path: '*',
      name: 'ZsdxIndex',
      component: ZsdxIndex
    }
  ]
})
