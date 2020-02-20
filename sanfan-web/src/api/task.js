import axios from '@/libs/api.request'

const URL_PREFIX = '/office/task/'
/**
 * 新增任务
 * */
export const createOne = data => {
  return axios.request({
    url: URL_PREFIX,
    data,
    method: 'post'
  })
}
/**
 * 更新任务审批状态
 * */
export const changeAuditStatus = data => {
  return axios.request({
    url: URL_PREFIX + 'changeAuditStatus',
    data,
    method: 'put'
  })
}
/**
 * 修改任务状态
 * */
export const changeTaskStatus = data => {
  return axios.request({
    url: URL_PREFIX + 'changeTaskStatus',
    data,
    method: 'put'
  })
}
/**
 * 取消任务-删除
 * */
export const deleteTask = id => {
  return axios.request({
    url: URL_PREFIX + `deleteTask/${id}`,
    method: 'delete'
  })
}
/**
 * 获取任务列表
 * */
export const myTaskList = data => {
  return axios.request({
    url: URL_PREFIX + 'myTaskList',
    data,
    method: 'post'
  })
}
/**
 * 任务搜索
 * */
export const searchTask = data => {
  return axios.request({
    url: URL_PREFIX + 'searchTask',
    data,
    method: 'post'
  })
}
/**
 * 获取已审批列表
 * */
export const searchTaskByAuditStatus = data => {
  return axios.request({
    url: URL_PREFIX + 'searchTaskByAuditStatus',
    data,
    method: 'get'
  })
}
/**
 * 提交任务总结
 * */
export const submitTaskSummary = data => {
  return axios.request({
    url: URL_PREFIX + 'submitTaskSummary',
    data,
    method: 'put'
  })
}
/**
 * 任务详情
 * */
export const taskDetail = id => {
  return axios.request({
    url: URL_PREFIX + `taskDetail/${id}`,
    method: 'get'
  })
}
/**
 * 管理员查看直属员工列表
 * */
export const taskManager = data => {
  return axios.request({
    url: URL_PREFIX + 'taskManager',
    data,
    method: 'get'
  })
}
/**
 * 修改
 * */
export const update = data => {
  return axios.request({
    url: URL_PREFIX + 'update',
    data,
    method: 'put'
  })
}
