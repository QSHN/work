import { setToken, getToken } from '@/libs/util'
import axios from '../../libs/api.request'
import {
  login,
  getUser,
  updateUser
} from '@/api/user'

export default {
  state: {
    token: getToken(),
    user: null,
    access: []
  },
  getters: {
    myUser: state => state.user
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    user (state, data) {
      state.user = data
    },
    setAccess (state, access) {
      state.access = access
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit, dispatch, getters }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          account: userName,
          password,
          uuid: 'web'
        }).then(res => {
          const data = res.data
          axios.setAuthorization('Bearer ' + data.token)
          commit('setToken', 'Bearer ' + data.token)
          commit('user', data.profile)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户信息
    getUser ({ state, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        try {
          getUser(state.token).then(res => {
            const data = res.data
            commit('user', data)
            dispatch('getOssRole')
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve) => {
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 更新用户信息
    updateUser ({ state, commit, dispatch }, { user }) {
      return new Promise((resolve, reject) => {
        try {
          updateUser(user).then(res => {
            commit('user', user)
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
