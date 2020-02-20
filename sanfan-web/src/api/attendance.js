import axios from '@/libs/api.request'

const URL_PREFIX = '/office/attendance/'

/**
 * 审批打卡详情
 */
export const audit = data => {
  return axios.request({
    url: URL_PREFIX + 'audit',
    data,
    method: 'post'
  })
}

/**
 * 获取打卡记录
 */
export const getRecord = data => {
  return axios.request({
    url: URL_PREFIX + 'getRecord',
    data,
    method: 'post'
  })
}

/**
 * 获取考勤规则
 */
export const getRules = () => {
  return axios.request({
    url: URL_PREFIX + 'getRules',
    method: 'get'
  })
}

/**
 * 获取考勤模板
 */
export const getTemplateList = () => {
  return axios.request({
    url: URL_PREFIX + 'getTemplateList',
    method: 'get'
  })
}

/**
 * 查看打卡详情
 */
export const record = id => {
  return axios.request({
    url: URL_PREFIX + `record/${id}`,
    method: 'get'
  })
}

/**
 * 汇报对象查看考勤对象
 */
// export const reportUsers = type => {
//   return axios.request({
//     url: URL_PREFIX + `reportUsers/${type}`,
//     method: 'post'
//   })
// }

/**
 * 考勤统计
 */
export const statistics = data => {
  return axios.request({
    url: URL_PREFIX + 'statistics',
    data,
    method: 'post'
  })
}

/**
 * 保存考勤模板
 */
export const saveTemplate = data => {
  return axios.request({
    url: URL_PREFIX + 'saveTemplate',
    data,
    method: 'post'
  })
}

/**
 * 获取考勤模板详情
 */
export const templateDetail = templateId => {
  return axios.request({
    url: URL_PREFIX + `templateDetail/${templateId}`,
    method: 'get'
  })
}

/**
 * 打卡
 */
export const timeRecord = data => {
  return axios.request({
    url: URL_PREFIX + 'timeRecord',
    data,
    method: 'post'
  })
}

/**
 * 更新打卡
 */
export const updateRecord = data => {
  return axios.request({
    url: URL_PREFIX + 'updateRecord',
    data,
    method: 'post'
  })
}

/**
 * 我的考勤统计列表
 */
export const statisticsByCheck = data => {
  return axios.request({
    url: URL_PREFIX + 'statisticsByCheck',
    data,
    method: 'post'
  })
}

/**
 * 考勤管理统计列表
 */
export const statisticsByApproval = data => {
  return axios.request({
    url: URL_PREFIX + 'statisticsByApproval',
    data,
    method: 'post'
  })
}

/**
 * 考勤组删除
 */
export const templateDelete = templateId => {
  return axios.request({
    url: URL_PREFIX + `del/${templateId}`,
    method: 'get'
  })
}
