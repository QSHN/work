import axios from '@/libs/api.request'

const URL_PREFIX = '/office/daily/'

/**
 * 写日报
 *  */
export const createOne = data => {
  return axios.request({
    url: URL_PREFIX,
    data,
    method: 'post'
  })
}
/**
 * 更新日报审批状态
 *  */
export const changeAuditStatus = data => {
  return axios.request({
    url: URL_PREFIX + 'changeAuditStatus',
    data,
    method: 'put'
  })
}
/**
 * 日报详情
 *  */
export const dailyDetails = id => {
  return axios.request({
    url: URL_PREFIX + `dailyDetails/${id}`,
    method: 'post'
  })
}
/**
 * 修改日报未读状态
 *  */
export const dailyUpdate = id => {
  return axios.request({
    url: URL_PREFIX + `dailyUpdate/${id}`,
    method: 'put'
  })
}
/**
 * 获取管理员下属日报列表
 *  */
export const getManagerDailyList = data => {
  return axios.request({
    url: URL_PREFIX + 'getManagerDailyList',
    data,
    method: 'get'
  })
}
/**
 * 获取自己的日报列表
 *  */
export const getMyDailyList = data => {
  return axios.request({
    url: URL_PREFIX + 'getMyDailyList',
    data,
    method: 'get'
  })
}
/**
 * 查找日报列表
 *  */
export const searchDailyList = data => {
  return axios.request({
    url: URL_PREFIX + 'searchDailyList',
    data,
    method: 'post'
  })
}
/**
 * 修改日报
 *  */
export const updateDaily = data => {
  return axios.request({
    url: URL_PREFIX + 'updateDaily',
    data,
    method: 'post'
  })
}
