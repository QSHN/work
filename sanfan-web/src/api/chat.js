import axios from '@/libs/api.request'

const GROUP_URL_PREFIX = '/message/chat/group/'

/**
 * 创建群聊
 */
export const createOne = data => {
  return axios.request({
    url: GROUP_URL_PREFIX,
    data,
    method: 'post'
  })
}
/**
 * 禁言白名单
 */
export const addWhitelist = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'addWhitelist',
    data,
    method: 'post'
  })
}
/**
 * 全部禁言
 */
export const banGroup = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'banGroup',
    data,
    method: 'post'
  })
}
/**
 * 禁言
 */
export const banMember = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'banMember',
    data,
    method: 'post'
  })
}
/**
 * 转让群主
 */
export const changeMaster = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'changeMaster',
    data,
    method: 'post'
  })
}
/**
 * 加入群聊
 */
export const join = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'join',
    data,
    method: 'post'
  })
}
/**
 * 移除成员
 */
export const quit = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'quit',
    data,
    method: 'post'
  })
}
/**
 * 退出群聊
 */
export const quitOne = id => {
  return axios.request({
    url: GROUP_URL_PREFIX + `quit/${id}`,
    method: 'post'
  })
}
/**
 * 移除禁言白名单
 */
export const removeWhitelist = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'removeWhitelist',
    data,
    method: 'post'
  })
}
/**
 * 修改群名称
 */
export const rename = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'rename',
    data,
    method: 'post'
  })
}
/**
 * 获取群成员
 */
export const searchMember = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'searchMember',
    data,
    method: 'post'
  })
}
/**
 * 设置仅群主管理
 */
export const setOnlyMasterManage = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'setOnlyMasterManage',
    data,
    method: 'post'
  })
}
/**
 * 解除禁言
 */
export const unBanMember = data => {
  return axios.request({
    url: GROUP_URL_PREFIX + 'unBanMember',
    data,
    method: 'post'
  })
}
/**
 * 解散群聊
 */
export const deleteOne = id => {
  return axios.request({
    url: GROUP_URL_PREFIX + `${id}`,
    method: 'delete'
  })
}
/**
 * 获取群聊信息
 */
export const getOne = id => {
  return axios.request({
    url: GROUP_URL_PREFIX + `${id}`,
    method: 'get'
  })
}

/**
 * 心跳检测
 * 目前没有后端接口
 */
export const heartbeat = () => {
  return Promise.resolve(true)
}
