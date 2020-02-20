import { login, logout } from '@/api/user'
import {
  findLast,
  delNotification,
  getMyNotifications,
  createTestData,
  read,
  readAll,
  clearAll
} from '../../api/notification'
import axios from '../../libs/api.request'
import { getSelfInfo } from '../../api/employee'
import { setToken, getToken } from '@/libs/util'

import Cookies from 'js-cookie'
import config from '@/config'
const RONG_CLOUD_KEY = 'rongCloud'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    userInfo: {},
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageContentStore: {}
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    updateMessageContentStore (state, { id, content }) {
      state.messageContentStore[id] = content
    },
    readAll (state) {
      state.messageUnreadList.forEach(item => {
        item.status = 'READ'
      })
      state.messageReadedList = [
        ...state.messageUnreadList,
        ...state.messageReadedList
      ]
      state.messageUnreadList.length = 0
      state.messageUnreadList = []
    },
    moveMsg (state, { from, to, id }) {
      const index = state[from].findIndex(_ => _.id === id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    },
    delMsg (state, { key, id }) {
      const index = state[key].findIndex(_ => _.id === id)
      const msgItem = state[key].splice(index, 1)[0]
      msgItem.loading = false
    }
  },
  getters: {
    getUserInfo: state => state.userInfo,
    myProfile: state => state.userInfo,
    myUserId: state => state.userInfo.id,
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password, companyId }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
          companyId
        })
          .then(res => {
            const data = res.data
            commit('setToken', data.id)
            commit('setUserInfo', data.employee)
            commit('setAvatar', data.employee.avatar)
            // commit('setAccess', [data.employee.role])
            commit('setHasGetInfo', true)
            // 登陆时服务器就获取了融云的token
            commit('UPDATE_TOKEN', data.rongCloud)
            // 需要缓存，刷新页面时候用到
            Cookies.set(RONG_CLOUD_KEY, data.rongCloud, {
              expires: config.cookieExpires || 1
            })
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('setToken', '')
            commit('setAccess', [])
            commit('setUserInfo', {})
            resolve()
          })
          .catch(err => {
            reject(err)
          })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit, getters }) {
      return new Promise((resolve, reject) => {
        try {
          axios.setAuthorization(state.token)

          Promise.all([
            ''
          ]).then().catch()
          getSelfInfo(state.token).then(res => {
            const data = res.data
            commit('setAvatar', data.avatar)
            commit('setUserInfo', data)
            // commit('setAccess', [data.role])
            commit('setHasGetInfo', true)

            if (!getters.getRongCloudToken) {
              // 刷新页面时，需要将融云Token带回
              commit('UPDATE_TOKEN', Cookies.get(RONG_CLOUD_KEY))
            }
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      findLast().then(res => {
        const { data } = res
        commit('setMessageCount', data.count)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMyNotifications()
          .then(res => {
            const list = res.data.list
            if (!list.length) createTestData() // 测试专用，无消息时，自动创建20条消息测试
            let unread = []
            let readed = []

            list.forEach(item => {
              commit('updateMessageContentStore', {
                id: item.id,
                content: item
              })
              if (item.status === 'UNREAD') {
                unread.push(item)
              } else if (item.status === 'READ') {
                readed.push(item)
              }
            })
            commit(
              'setMessageUnreadList',
              unread.sort(
                (a, b) => new Date(b.create_time) - new Date(a.create_time)
              )
            )
            commit(
              'setMessageReadedList',
              readed
                .map(_ => {
                  _.loading = false
                  return _
                })
                .sort(
                  (a, b) => new Date(b.create_time) - new Date(a.create_time)
                )
            )
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          read(id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { id }) {
      return new Promise((resolve, reject) => {
        commit('moveMsg', {
          from: 'messageUnreadList',
          to: 'messageReadedList',
          id
        })
        commit('setMessageCount', state.unreadCount - 1)
        resolve()
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { id }) {
      return new Promise((resolve, reject) => {
        delNotification(id)
          .then(() => {
            commit('delMsg', {
              key: 'messageReadedList',
              id
            })
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 删除所有消息
    removeAllMessage ({ commit }) {
      clearAll().then(res => {
        commit('setMessageUnreadList', [])
        commit('setMessageReadedList', [])
        commit('setMessageCount', 0)
      })
    },
    // 全部已读
    readAllMessage ({ commit }) {
      readAll().then(res => {
        commit('readAll')
        commit('setMessageCount', 0)
      })
    }
  }
}
