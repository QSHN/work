import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

const judgeAuthority = (title, myInfo) => {
  let bool = true
  if (myInfo.role !== 'admin') {
    const pList = myInfo.permission.permission
    const checked = myInfo.permission.checked
    const findFun = (list) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].label === title) {
          const look = list[i].children.find(f => f.label === '查看权')
          if (look.children) {
            let isFind = false
            look.children.forEach((f, i) => {
              if (checked.find(id => f.id.substr(0, id.length) === id)) {
                bool = true
                isFind = true
              }
            })
            if (!isFind) bool = false
          } else {
            bool = !!checked.find(id => look.id.substr(0, id.length) === id)
          }
          return
        } else if (list[i].children && list[i].children.length) {
          findFun(list[i].children)
        }
      }
    }
    findFun(pList)
  }
  return bool
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/home' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.myInfo
      if (hasGetUserInfo) {
        if (judgeAuthority(to.meta.title, hasGetUserInfo)) {
          next()
        } else {
          Message.error(`您没有${to.meta.title}的查看权， 请联系管理员`)
          NProgress.done()
        }
      } else {
        try {
          // get user info
          Promise.all([
            store.dispatch('user/getInfo'),
            store.dispatch('basicInfo/queryBasicInfo'),
            store.dispatch('utils/getOssRole')
          ]).then(([user, info]) => {
            if (judgeAuthority(to.meta.title, user)) {
              next()
            } else {
              Message.error(`您没有${to.meta.title}的查看权， 请联系管理员`)
              NProgress.done()
            }
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
