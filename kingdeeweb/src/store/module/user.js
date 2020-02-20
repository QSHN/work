import { setToken, getToken } from '@/libs/util'
import axios from '../../libs/api.request'

import {
  login,
  getUser,
  updateUser,
  queryUserList
} from '../../api/user'
import { queryUserPermission, queryUserGroup } from '../../api/userManage'
import { queryAccountSet } from '../../api/accountSet'

export default {
  state: {
    token: getToken(),
    user: null,
    access: [],
    accountSet: null,
    myPermission: [],
    userList: [],
    adminList: [],
    accountSetUserList: [],
    groupList: []
  },
  getters: {
    myUser: state => state.user,
    accountSet: state => state.accountSet,
    myPermission: state => state.myPermission,
    userList: state => state.userList,
    adminList: (state) => {
      let uList = state.userList.filter(f => state.accountSet.userList.includes(f._id))
      let admin = state.groupList.find(f => f.name === '管理组')
      let result = []
      if (admin) result = uList.filter(f => f.group && f.group.includes(admin._id))
      return result
    },
    accountSetUserList: (state) => {
      return state.userList.filter(f => state.accountSet.userList.includes(f._id))
    },
    groupList: state => state.groupList
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
    },
    accountSet (state, accountSet) {
      state.accountSet = accountSet
    },
    setPermission (state, data) {
      state.myPermission = data
    },
    setUserList (state, data) {
      state.userList = data
    },
    setGroupList (state, data) {
      state.groupList = data
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
          uuid: 'web' + parseInt(Math.random() * 1000)
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
      let interval = null
      if (interval) clearInterval(interval)
      return new Promise((resolve, reject) => {
        try {
          getUser(state.token).then(res => {
            const data = res.data
            commit('user', data)
            if (data.useAccountSet) {
              dispatch('getAccountSet', data.useAccountSet)
              dispatch('getSelectInfo', data.useAccountSet)
            }
            resolve(data)
          }).catch(err => {
            reject(err)
          })
          interval = setInterval(() => {
            getUser(state.token).then(() => {
            }).catch(() => {
              commit('user', null)
              clearInterval(interval)
            })
          }, 10000)
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
            if (user.useAccountSet) dispatch('getAccountSet', user.useAccountSet)
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取账套信息
    getAccountSet ({ state, commit }, accountId) {
      return new Promise((resolve, reject) => {
        try {
          queryAccountSet({ _id: accountId }).then(res => {
            if (res.data && res.data.length) {
              commit('accountSet', res.data[0])
            }
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取个人权限
    getUserPermission ({ state, commit }, { accountSetId, userId }) {
      return new Promise((resolve, reject) => {
        try {
          queryUserPermission({
            accountSetId,
            userId
          }).then(res => {
            if (res.data) commit('setPermission', res.data)
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取用户列表
    getUserList ({ state, commit }, filter) {
      return new Promise((resolve, reject) => {
        try {
          queryUserList(filter).then(res => {
            commit('setUserList', res.data)
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取用户列表
    getGroupList ({ state, commit }, filter) {
      return new Promise((resolve, reject) => {
        try {
          queryUserGroup(filter).then(res => {
            commit('setGroupList', res.data)
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
