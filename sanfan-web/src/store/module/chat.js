import Vue from 'vue'
import config from '../../config'
import { getOne, heartbeat } from '@/api/chat'

const appKey =
  process.env.NODE_ENV === 'development'
    ? config.rongAppKey.dev
    : config.rongAppKey.pro
// const token = "yMIUTTvGwMeSDRKcHnKt3xdFmp6aDaAWDfF7nno5fzOcR+Zqyuv8mywvHjuQorxNgDRt/0qLJoo3bELEDps2Eq7Q/wqbFaCr";
let forceUpdateTokenCount = 2 // 只允许更新两次,防止死循环
let reconnectTimes = 0
let timeInterval = 20
let checkNetworkTimeID
let reconnectTimeID
let isConnecting = false

// 重连
function reconnectServer () {
  if (reconnectTimeID) {
    clearTimeout(reconnectTimeID)
  }
  reconnectTimeID = setTimeout(function () {
    console.log('网络正常，正在重连')
    // 注意reconnect方法，必须要有网的时候请求，否则任何方法都无法再次连接
    RongIMClient.reconnect({
      onSuccess: function () {
        reconnectTimes = 0
        isConnecting = false
        console.log('重连成功', new Date().toLocaleString())
        if (reconnectTimeID) clearTimeout(reconnectTimeID)
      },
      onError: function () {
        isConnecting = false
        if (reconnectTimes <= 5) {
          reconnectServer()
          reconnectTimes += 1
        } else {
          reconnectTimes = 0
          console.log('网络正常，重连失败！！！', new Date().toLocaleString())
        }
      }
    })
  }, timeInterval * reconnectTimes * 1000)
}

// 测试网络
function checkNetwork (callback) {
  console.log('正在测试网络', new Date().toLocaleString())
  heartbeat()
    .then(function () {
      if (checkNetworkTimeID) clearTimeout(checkNetworkTimeID)
      if (callback && callback.onSuccess) callback.onSuccess()
    })
    .catch(function () {
      if (checkNetworkTimeID) clearTimeout(checkNetworkTimeID)
      checkNetworkTimeID = setTimeout(function () {
        checkNetwork(callback)
      }, 5000)
    })
}

/**
 * 初始化对话信息
 * @param {Object} conversation RongCloud Conversation
 * @param {Promise} dispatch store.dispatch
 */
function initGroupInfo (conversation, state, dispatch) {
  getOne(conversation.targetId)
    .then(rst => {
      if (!rst.data) {
        dispatch('IM_DEL_CHAT', conversation)
        throw new Error('关闭错误的群对话')
      }
      return dispatch('IM_SET_GROUP', rst.data)
    })
    .then(() => {
      conversation.group = state.chatGroups[conversation.targetId]
      getGroupLastContent(conversation)
    })
    .catch(error => {
      console.error('Fail Get Group Info', error)
    })
}
/**
 * 更新群对话的最后聊天记录
 * @param {Object} conversation RongCloud Conversation
 */
function getGroupLastContent (conversation) {
  if (
    conversation &&
    conversation.latestMessage &&
    conversation.latestMessage.content
  ) {
    let speaker
    if (
      conversation.latestMessage.senderUserId &&
      conversation.group.members &&
      conversation.group.members.length
    ) {
      speaker = conversation.group.members.find(
        p => p.employeeId === conversation.latestMessage.senderUserId
      )
    }
    if (conversation.latestMessage.content.content) {
      conversation.lastContent = RongIMLib.RongIMEmoji.emojiToHTML(
        (speaker ? `${speaker.name}: ` : '') +
          conversation.latestMessage.content.content
      )
    } else {
      conversation.lastContent =
        (speaker ? `${speaker.name}: ` : '') +
          conversation.latestMessage.content.name || ''
    }
  }
}

const state = {
  // 聊天记录
  chatlist: {},
  connectionStatus: '',
  clientStatus: '',
  token: '',
  // 对话列表
  conversationList: [],

  // ============== PC聊天框架补充STATE ===========
  // 是否已经初始化
  inited: false,
  tag: 'chat',
  searchText: '',
  selectId: '',
  selectFriendId: '',
  // 初始化后的联系人
  friendlist: [],

  // ============== 群聊 ==============
  // 当前群id 就是 sessionid
  // 群组记录,类Map对象
  chatGroups: {}
}

const getters = {
  // clientInstance: state => RongIMClient.getInstance()
  getChatRecord: state => targetId => {
    if (!state.chatlist[targetId]) {
      state.chatlist[targetId] = []
    }
    return state.chatlist[targetId]
  },
  clientStatus: state => state.clientStatus,
  connectionStatus: state => state.connectionStatus,
  chatRecord: state => state.chatlist,
  getRongCloudToken: state => state.token,

  // ================== PC聊天框架补充GETTER ====================

  chatTag: state => state.tag,
  chatFriendList: state => state.friendlist,
  conversationList: state => state.conversationList,
  chatSession: state => state.selectId,

  // 筛选出含有搜索值的聊天列表
  searchedChatlist: state => {
    let list = []
    for (let cvst of state.conversationList) {
      if (cvst.conversationType === RongIMLib.ConversationType.PRIVATE) {
        let p = cvst.friend
        if (
          p &&
          ((p.name && p.name.includes(state.searchText)) ||
            (p.department && p.department.includes(state.searchText)) ||
            (p.job && p.job.includes(state.searchText)))
        ) {
          list.push(cvst)
        }
      } else if (cvst.conversationType === RongIMLib.ConversationType.GROUP) {
        let group = cvst.group
        if (group && group.name && group.name.includes(state.searchText)) {
          list.push(cvst)
        }
      }
    }
    // 排序
    list.sort((a, b) => {
      // 先看置顶
      if (a.isTop && !b.isTop) {
        return -1
      } else if (!a.isTop && b.isTop) {
        return 1
      } else if (a.isTop === b.isTop) {
        // 都置顶或都不置顶
        if (
          a.latestMessage &&
          a.latestMessage.sentTime &&
          b.latestMessage &&
          b.latestMessage.sentTime
        ) {
          return b.latestMessage.sentTime - a.latestMessage.sentTime
        }
      }
    })
    return list
  },
  // 筛选出含有搜索值的好友列表
  searchedChatFriendlist: state =>
    state.friendlist.filter(p => {
      return (
        (p.name && p.name.includes(state.searchText)) ||
        (p.department && p.department.includes(state.searchText)) ||
        (p.job && p.job.includes(state.searchText))
      )
    }),
  // 通过当前选择是哪个对话匹配相应的对话,getChatRecord的特例
  selectedChat: state => {
    console.log('SelectId %s', state.selectId)
    if (!state.selectId) return []
    if (!state.chatlist[state.selectId]) {
      state.chatlist[state.selectId] = []
    }
    return state.chatlist[state.selectId]
  },
  // 返回当前是哪个对话触发的
  selectedConversation: state => {
    return state.conversationList.find(
      // 被群禁言的人，发送对话会产生一个错误的对话
      cvst => cvst.targetId === state.selectId && (cvst.group || cvst.friend)
    )
  },
  // 通过当前选择是哪个好友匹配相应的好友
  selectedChatFriend: state =>
    state.friendlist.find(friend => friend.id === state.selectFriendId),

  getHistoryMessages: state => ({
    conversationType = RongIMLib.ConversationType.PRIVATE, // 消息类型，默认是单聊
    targetId = state.selectId, // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
    timestrap = null, // 默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
    count = 20 // 每次获取的历史消息条数，范围 0-20 条，可以多次获取。
  }) =>
    new Promise((resolve, reject) => {
      let st = setInterval(() => {
        if (state.clientStatus !== '连接成功') return false

        clearInterval(st) // 成功则清除轮询

        const client = RongIMLib.RongIMClient.getInstance()
        if (!client.getHistoryMessages) {
          return reject(new Error('getHistoryMessages is undefined '))
        }

        console.log(
          'Ask For History Messages conversationType, targetId, timestrap, count, ',
          conversationType,
          targetId,
          timestrap,
          count
        )

        client.getHistoryMessages(
          conversationType,
          targetId,
          timestrap,
          count,
          {
            onSuccess: (list, hasMsg) => {
              // list => Message 数组, hasMsg => 是否还有历史消息可以获取
              console.log(
                'Got History Messages : List => %o ; HasMsg => %o ',
                list,
                hasMsg
              )
              // 返回列表及内容
              return resolve({ list, hasMsg })
            },
            onError: error => {
              console.error('GetHistoryMessages,errorcode:' + error)
              return reject(error)
            }
          }
        )
      }, 1000)
    }),

  // ============================ 群聊 =======================================
  // allChatGroups: state => Object.assign({}, state.chatGroups),
  selectedGroup: state => {
    if (!state.selectId) return null
    return state.chatGroups[state.selectId]
  }
}

const actions = {
  IM_INIT ({ commit, state, dispatch }) {
    if (state.inited) return true
    console.log('开始初始化融云', appKey)
    RongIMLib.RongIMClient.init(appKey)
    RongIMLib.RongIMEmoji.init()
    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            commit('UPDATE_STATUS', '链接成功')
            isConnecting = false
            break
          case RongIMLib.ConnectionStatus.CONNECTING:
            commit('UPDATE_STATUS', '正在链接')
            break
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            commit('UPDATE_STATUS', '断开连接')
            dispatch('IM_RECONNECT')
            break
          case RongIMLib.ConnectionStatus.CONNECTION_CLOSED:
            commit('UPDATE_STATUS', '连接关闭')
            dispatch('IM_RECONNECT')
            break
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            commit('UPDATE_STATUS', '其他设备登录')
            break
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            commit('UPDATE_STATUS', '域名不正确')
            break
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            commit('UPDATE_STATUS', '网络不可用')
            dispatch('IM_RECONNECT')
            break
          default:
            console.log('ConnectionStatus', status)
        }
      }
    })

    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
      // 接收到的消息
      onReceived: function (message) {
        // 判断消息类型
        switch (message.messageType) {
          case RongIMClient.MessageType.TextMessage:
            commit('PUSH_MEG', message)
            // message.content.content => 消息内容
            break
          case RongIMClient.MessageType.VoiceMessage:
            commit('PUSH_MEG', message)
            // 对声音进行预加载
            // message.content.content 格式为 AMR 格式的 base64 码
            break
          case RongIMClient.MessageType.ImageMessage:
            commit('PUSH_MEG', message)
            // message.content.content => 图片缩略图 base64。
            // message.content.imageUri => 原图 URL。
            break
          case RongIMClient.MessageType.FileMessage:
            commit('PUSH_MEG', message)
            // message.content.content => 图片缩略图 base64。
            // message.content.imageUri => 原图 URL。
            break
          case RongIMClient.MessageType.DiscussionNotificationMessage:
            commit('PUSH_MEG', message)
            // message.content.extension => 讨论组中的人员。
            break
          case RongIMClient.MessageType.LocationMessage:
            commit('PUSH_MEG', message)
            // message.content.latiude => 纬度。
            // message.content.longitude => 经度。
            // message.content.content => 位置图片 base64。
            break
          case RongIMClient.MessageType.RichContentMessage:
            commit('PUSH_MEG', message)
            // message.content.content => 文本消息内容。
            // message.content.imageUri => 图片 base64。
            // message.content.url => 原图 URL。
            break
          case RongIMClient.MessageType.RecallCommandMessage:
            commit('DEL_MEG', { message })
            // 消息撒回
            break
          case RongIMClient.MessageType.ReadReceiptMessage:
            console.log('已读')
            commit('SET_READ_STATUS', message)
            // do something...
            break
          case RongIMClient.MessageType.InformationNotificationMessage:
            // do something...
            break
          case RongIMClient.MessageType.ContactNotificationMessage:
            // do something...
            break
          case RongIMClient.MessageType.ProfileNotificationMessage:
            // do something...
            break
          case RongIMClient.MessageType.CommandNotificationMessage:
            // do something...
            break
          case RongIMClient.MessageType.CommandMessage:
            // do something...
            break
          case RongIMClient.MessageType.UnknownMessage:
            // do something...
            break
          default:
            console.log('ReceiveMessage', message)
          // do something...
        }

        // 重新获取对话列表
        dispatch('IM_CHAT_LIST')
      }
    })

    commit('IM_INITED', true)

    return true
  },
  IM_LOGIN (context, token) {
    console.log('用户登陆融云')

    // context.commit('UPDATE_TOKEN', token)
    const onSuccess = userId => {
      console.log('Connect successfully.' + userId)
      context.commit('CLIENT_STATUS', '连接成功')
      forceUpdateTokenCount = 0
      // context.dispatch('IM_RECONNECT');
    }
    const onTokenIncorrect = () => {
      context.commit('CLIENT_STATUS', 'token无效')
      if (
        context.state.connectionStatus !== '正在链接' &&
        forceUpdateTokenCount > 0
      ) {
        forceUpdateTokenCount--
        // 目前原生版本不支持重新获取融云token
        // token在登陆的时候就获取了
        context.dispatch('IM_LOGIN', context.state.token)

        // 重新获取有效Token, 并重新登陆
        // console.log('token正在获取')
        // updateRongToken({ forceUpdate: true })
        //   .then(res => {
        //     console.log('token获取成功', res.data)
        //     context.dispatch('IM_LOGIN', res.data)
        //   })
        //   .catch(err => {
        //     console.log('无法获取有效token, 聊天功能无法使用', err)
        //   })
      }
    }
    /*
    const onReError = errorCode => {
      var info = ''
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时'
          break
        case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
          info = '不可接受的协议版本'
          break
        case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
          info = 'appkey不正确'
          break
        case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
          info = '服务器不可用'
          break
      }
      context.commit('CLIENT_STATUS', info)
      console.log('IM_LOGIN', errorCode)
    }
    */
    const onError = errorCode => {
      var info = ''
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时'
          break
        case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
          info = '不可接受的协议版本'
          break
        case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
          info = 'appkey不正确'
          break
        case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
          info = '服务器不可用'
          break
      }
      context.commit('CLIENT_STATUS', info)
      debugger
      console.log(errorCode)
    }
    RongIMClient.connect(token || context.state.token, {
      onSuccess,
      onTokenIncorrect,
      onError
    })
  },
  IM_RECONNECT ({ commit, state, dispatch, getters }, data) {
    if (state.token) {
      console.log(
        'IM_RECONNECT',
        new Date().toLocaleString(),
        'isConnecting:' + isConnecting
      )
      isConnecting = true
      // 重新获取对话列表
      dispatch('IM_CHAT_LIST')
      checkNetwork({
        onSuccess: function () {
          reconnectServer()
        }
      })
    }
  },
  IM_SEND_MSG ({ commit, state, dispatch }, data) {
    let msg
    if (data.msgType === 'image') {
      msg = new RongIMLib.ImageMessage({
        content: data.content.content,
        imageUri: data.content.imageUri
      })
    } else if (data.msgType === 'file') {
      msg = new RongIMLib.FileMessage({
        name: data.content.name,
        size: data.content.size,
        type: data.content.type,
        fileUrl: data.content.fileUrl
      })
    } else {
      msg = new RongIMLib.TextMessage({ content: data.content.content })
    }
    var conversationType = RongIMLib.ConversationType[data.type] // 单聊,其他会话选择相应的消息类型即可。
    var targetId = data.targetId // 目标 Id
    RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
      onSuccess: function (message) {
        // message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
        console.log('Send successfully')
        // 执行回调函数
        if (data.onSuccess) {
          data.onSuccess(message)
          // 重新获取对话列表
          dispatch('IM_CHAT_LIST')
        }
      },
      onError: function (errorCode, message) {
        var info = ''
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时'
            break
          case RongIMLib.ErrorCode.UNKNOWN:
            info = '未知错误'
            break
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息'
            break
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中'
            break
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中'
            break
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中'
            break
          case 30002:
            dispatch('IM_RECONNECT')
            break
          default:
            info = errorCode
            break
        }
        console.error('发送失败:' + info)

        if (data.onError) {
          data.onError(message, info)
        }
      }
    })
  },
  IM_PUSH_MEG ({ commit, state, dispatch }, data) {
    commit('PUSH_MEG', data)
    // 重新获取对话列表
    dispatch('IM_CHAT_LIST')
  },
  IM_READ_MEG ({ commit, state, dispatch, getters }, data) {
    const { messageUId, targetId, sentTime } = data
    var type = '1' // 备用，默认赋值 1 即可。
    var msg = new RongIMLib.ReadReceiptMessage({
      messageUId: messageUId,
      lastMessageSendTime: sentTime,
      type: type
    })

    // 单聊,其他会话选择相应的消息类型即可。
    var conversationType =
      getters.selectedConversation.conversationType ||
      RongIMLib.ConversationType.PRIVATE
    RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
      onSuccess: function (message) {
        // message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
        console.log('isRead successfully')
        // 重新获取对话列表
        dispatch('IM_CHAT_LIST')
      },
      onError: function (errorCode, message) {}
    })
  },
  IM_DEL_MEG ({ commit, state, dispatch }, message) {
    console.log('准备删除', message.content.content, message.messageUId)
    RongIMClient.getInstance().sendRecallMessage(message, {
      onSuccess: message => {
        console.log('删除成功', message.content.messageUId, message)
        commit('DEL_MEG', { message, me: true })
        // 重新获取对话列表
        dispatch('IM_CHAT_LIST')
      },
      onError: (errorCode, message) => {
        console.log('删除失败', message)
      }
    })
  },
  IM_READ_MEG_ALL ({ commit, state, dispatch }, targetId) {
    const chatlist = state.chatlist[targetId]
    if (!chatlist) return
    for (let i = chatlist.length - 1; i >= 0; i--) {
      let msg = chatlist[i]
      if (
        !msg.sentStatus &&
        msg.receivedStatus === 1 &&
        msg.senderUserId === msg.targetId
      ) {
        msg.sentStatus = 50
        console.log('IM_READ_MEG' + msg.messageUId)
        dispatch('IM_READ_MEG', msg)
      }
    }
  },
  IM_CLEAR_UNREAD ({ commit, state, dispatch }, targetId) {
    var conversationType = RongIMLib.ConversationType.PRIVATE // 单聊,其他会话选择相应的消息类型即可。
    RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
      onSuccess: function () {
        console.log('clearUnreadCount::' + targetId)
        // 重新获取对话列表
        dispatch('IM_CHAT_LIST')
      },
      onError: function (errorCode) {}
    })
  },

  // =========================PC聊天框架补充ACTION========================
  // 初始化联系人列表。逻辑在上面的getter
  IM_INIT_FRIEND_LIST: async ({ commit, getters, dispatch }) => {
    // retrun if inited 已经初始化直接返回
    if (getters.friendlist && getters.friendlist.length) return null

    // temp 临时变量
    let friendlist = []
    let departmentName = ''

    try {
      // get contatcs from remote Server
      await dispatch('getContacts')
    } catch (error) {
      console.error("Can't get contacts from remote Server.", error)
      return null
    }

    if (!getters.contacts || !getters.contacts.length) return null

    friendlist = getters.contacts.slice(0)
    // sort by deparmentId 按部门排序
    friendlist.sort((a, b) => {
      if (a.departmentId === b.departmentId) return 0
      if (a.departmentId < b.departmentId) return -1
      return 1
    })

    // mark group initial 标记分组
    for (let i = 0; i < friendlist.length; i++) {
      if (departmentName !== friendlist[i].departmentName) {
        friendlist[i].initial = departmentName = friendlist[i].departmentName
      }
    }

    // 写到store
    commit('IM_INIT_FRIEND_LIST', friendlist.slice(0))

    // release 释放
    friendlist.length = 0
  },
  IM_SEARCH: ({ commit }, value) => {
    // 搜索延时
    setTimeout(() => {
      commit('IM_SEARCH', value)
    }, 300)
  },
  IM_SELECT_SESSION: ({ commit }, value) => commit('IM_SELECT_SESSION', value),
  IM_SELECT_FRIEND: ({ commit }, value) => commit('IM_SELECT_FRIEND', value),
  // 获取对话
  IM_CHAT_LIST: ({ state, commit, dispatch }) => {
    let st = setInterval(() => {
      if (state.clientStatus === '连接成功') {
        clearInterval(st)
        // Promise
        RongIMClient.getInstance().getConversationList(
          {
            onSuccess: list => {
              console.log('getConversationList', list)
              // 保存对话列表
              commit(
                'IM_CHAT_LIST',
                list.map((cvst, idx) => {
                  if (
                    cvst.conversationType === RongIMLib.ConversationType.PRIVATE
                  ) {
                    cvst.friend = state.friendlist.find(
                      fd => fd.id === cvst.targetId
                    )

                    // 如果找不到聊天对象，关闭该对话
                    if (!cvst.friend) dispatch('IM_DEL_CHAT', cvst)
                  } else if (
                    cvst.conversationType === RongIMLib.ConversationType.GROUP
                  ) {
                    // 处理群聊天
                    if (state.chatGroups[cvst.targetId]) {
                      cvst.group = state.chatGroups[cvst.targetId]
                      getGroupLastContent(cvst)
                    } else {
                      // 先不请求图片，只显示名字
                      cvst.group = {
                        id: cvst.targetId,
                        name: `群聊 ${idx}`
                      }

                      /**
                       * ************************
                       * 此处初始化群信息
                       * 信息后置处理
                       * ************************
                       */
                      initGroupInfo(cvst, state, dispatch)
                    }
                  }
                  return cvst
                })
              )
            },
            onError: error => {
              // do something...
              console.error('Error In getConversationList', error)
            }
          },
          null
        )
      }
    }, 1000)
  },
  // 关闭对话
  IM_DEL_CHAT: ({ dispatch }, { conversationType, targetId }) => {
    RongIMClient.getInstance().removeConversation(conversationType, targetId, {
      onSuccess () {
        // 删除会话成功 重新获取对话列表
        dispatch('IM_CHAT_LIST')
      },
      onError (error) {
        console.error(error)
      }
    })
  },
  // 置顶对话 1 置顶 0 解除
  IM_TOP_CHAT: ({ dispatch }, { conversationType, targetId, isTop }) => {
    RongIMClient.getInstance().setConversationToTop(
      conversationType,
      targetId,
      isTop,
      {
        onSuccess () {
          // 重新获取对话列表
          dispatch('IM_CHAT_LIST')
        },
        onError (error) {
          console.error(error)
        }
      }
    )
  },
  // 消息免打扰 1 免扰 0 解除
  IM_NOTIFY_CHAT: ({ dispatch }, { conversationType, targetId, status }) => {
    RongIMClient.getInstance().setConversationNotificationStatus(
      conversationType,
      targetId,
      status,
      {
        onSuccess () {
          // 重新获取对话列表
          dispatch('IM_CHAT_LIST')
        },
        onError (error) {
          console.error(error)
        }
      }
    )
  },

  // ============================ 群聊 =======================================
  IM_SET_GROUP: ({ commit }, group) => commit('IM_SET_GROUP', group)
}
const mutations = {
  UPDATE_STATUS: (state, payload) => {
    console.log(payload)
    state.connectionStatus = payload
  },
  CLIENT_STATUS: (state, payload) => {
    console.log(payload)
    state.clientStatus = payload
  },
  UPDATE_TOKEN: (state, payload) => {
    console.log('UPDATE RongCloud Token : ', payload)
    state.token = payload
  },
  PUSH_MEG: (state, data) => {
    let { targetId } = data
    let list = state.chatlist[targetId]
    if (list) {
      if (list.filter(msg => msg.messageUId === data.messageUId).length) {
        // 已存在则跳过
        return
      }
      list.push(data)
    } else {
      Vue.set(state.chatlist, targetId, [data])
      // state.chatlist[targetId] = [data];
    }
  },
  DEL_MEG: (state, data) => {
    let { message, me } = data
    let targetId = me ? message.content.targetId : message.targetId
    let list = state.chatlist[targetId]
    if (list) {
      let index = list.findIndex(
        msg => msg.messageUId === message.content.messageUId
      )
      console.log('删除ok', index)
      if (index >= 0) state.chatlist[targetId].splice(index, 1)
    }
  },
  SET_READ_STATUS: (state, message) => {
    const chatlist = state.chatlist[message.targetId]
    if (chatlist) {
      for (let i = chatlist.length - 1; i >= 0; i--) {
        let msg = chatlist[i]
        if (msg.messageUId === message.content.messageUId) {
          msg.receivedStatus = message.content.type
          msg.receivedTime = message.content.lastMessageSendTime
          break
        }
      }
    }
  },
  // 退出当前帐号
  IM_LOGOUT (state, data) {
    RongIMClient.getInstance().logout()
    RongIMClient.getInstance().clearCache()
    state.token = ''
    state.clientStatus = '退出登录'
    state.chatlist = {}
    state.conversationList = []
  },

  // =========================PC聊天框架补充MUTACTION=======================
  IM_INITED (state, value) {
    state.inited = value
  },
  IM_INIT_FRIEND_LIST (state, list) {
    state.friendlist = list
  },
  // 获取搜索值
  IM_SEARCH (state, value) {
    state.searchText = value
  },
  // 得知用户当前选择的是哪个对话。便于匹配对应的对话框
  IM_SELECT_SESSION (state, value) {
    state.selectId = value
  },
  // 得知用户当前选择的是哪个好友。
  IM_SELECT_FRIEND (state, value) {
    state.selectFriendId = value
  },
  // 切换界面
  IM_CHANGE_TAG (state, tag) {
    state.tag = tag
  },

  // 获取聊天列表
  IM_CHAT_LIST (state, list) {
    state.conversationList = list
  },

  // ============================ 群聊 =======================================
  IM_SET_GROUP (state, group) {
    if (!group.id) return
    // 如果存在ID更新群信息，没有则插入
    state.chatGroups[group.id] = Object.assign({}, group)
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
