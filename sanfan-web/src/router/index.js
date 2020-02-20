import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
const REGISTER_PAGE_NAME = 'register'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  let myCompany = store.getters.myCompany
  if (!token && to.name !== LOGIN_PAGE_NAME && to.name !== REGISTER_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (
    (myCompany.companyStatus === 'EXPIRED' || myCompany.companyStatus === 'UNUSE' || myCompany.surplusDays === 0) &&
    to.name !== 'trade_page' &&
    to.name !== 'buy_page' &&
    to.name !== 'pay_page' &&
    to.name !== 'login'
  ) {
    next({ name: 'trade_page' })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      Promise.all([
        store.dispatch('getUserInfo'),
        store.dispatch('getCompany')
      ]).then(([userInfo, company, personal]) => {
        const access = userInfo.permissions.map(v => v.code)
        access.push(userInfo.role)
        store.commit('setAccess', access)

        let myCompany = store.getters.myCompany
        if ((myCompany.companyStatus === 'EXPIRED' || myCompany.companyStatus === 'UNUSE' || myCompany.surplusDays === 0) &&
          to.name !== 'trade_page' &&
          to.name !== 'buy_page' &&
          to.name !== 'pay_page' &&
          to.name !== 'login'
        ) {
          next({ name: 'trade_page' })
        } else {
          turnTo(to, access, next)
        }
      }).catch((error) => {
        if (error) {
          setToken('')
          next({
            name: 'login'
          })
        }
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
