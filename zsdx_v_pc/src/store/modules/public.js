import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  isLoading: false,                    // 加载状态
  rememberUrl: '/',                   // 记住登录/注册前地址
  userInfo: null                      // 用户数据
}

// getters
const getters = {

}

// actions
const actions = {

}

// mutations
const mutations = {
  // 改变加载状态
  [types.LOADING_STATUS] (state, bool) {
    if (bool) {
      state.isLoading = true
    } else {
      let cycle2 = setTimeout(() => {
        state.isLoading = false
        clearTimeout(cycle2)
      }, 1000)
      cycle2
    }
  },

  // 记住登录/注册前地址
  [types.REMEMBER_URL] (state, url) {
    if (url !== '/login') state.rememberUrl = url
  },

  // userInfo 数据
  [types.USER_INFO] (state, {type, userInfo}) {
    if (type === 'get') {
      state.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    } else {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
