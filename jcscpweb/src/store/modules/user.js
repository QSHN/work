import {
  login,
  getCurrent,
  queryUser
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  myInfo: null,
  allUserList: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_MY_INFO: (state, myInfo) => {
    state.myInfo = myInfo
  },
  SET_ALL_USER: (state, list) => {
    state.allUserList = list
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        account: username.trim(),
        password: password,
        uuid: 'web' + parseInt(Math.random() * 1000000000)
      }).then(res => {
        commit('SET_MY_INFO', res.profile)
        commit('SET_TOKEN', res.token)
        setToken(res.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      getCurrent(state.token).then(res => {
        commit('SET_MY_INFO', res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
      let interval = null
      interval = setInterval(() => {
        getCurrent(state.token).then((res) => {
          // commit('SET_MY_INFO', res)
        }).catch(() => {
          commit('SET_MY_INFO', null)
          clearInterval(interval)
        })
      }, 10000)

      dispatch('queryAllUser')
    })
  },

  // 获取所有用户
  queryAllUser({ commit }) {
    return new Promise((resolve, reject) => {
      queryUser().then(res => {
        commit('SET_ALL_USER', res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

