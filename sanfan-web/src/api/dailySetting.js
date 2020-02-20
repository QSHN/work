import axios from '@/libs/api.request'

const URL_PREFIX = '/office/dailySetting/'

/**
 * 新增部门时自动添加日报管理模板
 */
export const createOne = data => {
  return axios.request({
    url: URL_PREFIX,
    data,
    method: 'post'
  })
}

/**
 * 新增部门时自动添加日报管理模板
 */
export const autoCreateDailyTemplate = id => {
  return axios.request({
    url: URL_PREFIX + `autoCreateDailyTemplate/${id}`,
    method: 'post'
  })
}

/**
 * 当前通过申请
 */
export const dailySetting = () => {
  return axios.request({
    url: URL_PREFIX + 'dailySetting',
    method: 'get'
  })
}

/**
 * 更新日报设置
 */
export const updateDailySetting = data => {
  return axios.request({
    url: URL_PREFIX + 'updateDailySetting',
    data,
    method: 'put'
  })
}
