import axios from '@/libs/api.request'
export const findLast = () => {
  return axios.request({
    url: '/message/notification/findLast',
    method: 'get'
  })
}
export const createTestData = () => {
  return axios.request({
    url: '/message/notification/createTestData',
    method: 'post'
  })
}
export const getMyNotifications = () => {
  return axios.request({
    url: '/message/notification/getMyNotifications',
    method: 'get'
  })
}
export const read = (id) => {
  return axios.request({
    url: '/message/notification/read/' + id,
    method: 'get'
  })
}
export const readAll = () => {
  return axios.request({
    url: '/message/notification/readAll',
    method: 'post'
  })
}
export const delNotification = (id) => {
  return axios.request({
    url: '/message/notification/' + id,
    method: 'DELETE'
  })
}
export const clearAll = () => {
  return axios.request({
    url: '/message/notification/clearAll',
    method: 'DELETE'
  })
}
export const getNotification = (id) => {
  return axios.request({
    url: '/message/notification/' + id,
    method: 'get'
  })
}
// DELETE /message/notification/clearAll 清空所有消息
// POST /message/notification/createTestData 为当前用户生成20条测试数据
// GET /message/notification/findLast 获取未读数和最后一条记录
// GET /message/notification/getMyNotifications 获取系统消息列表
// GET /message/notification/read/{id} 阅读消息
// POST /message/notification/readAll 全部已读
// DELETE /message/notification/{id} 删除消息
// GET /message/notification/{id} 获取消息详情
