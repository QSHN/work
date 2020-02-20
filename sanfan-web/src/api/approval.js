import axios from '@/libs/api.request'

const URL_PREFIX = '/office/approval/'

/**
 * 当前通过申请
 */
export const agreement = id => {
  return axios.request({
    url: URL_PREFIX + `agreement/${id}`,
    method: 'get'
  })
}

/**
 * 发起申请
 */
export const approval = data => {
  return axios.request({
    url: URL_PREFIX + 'approval',
    data,
    method: 'post'
  })
}

/**
 * 审批人员查看审批列表
 */
export const approvalManagerList = data => {
  return axios.request({
    url: URL_PREFIX + 'approvalManagerList',
    data,
    method: 'post'
  })
}

/**
 * 抄送人员查看列表
 */
export const copyList = data => {
  return axios.request({
    url: URL_PREFIX + 'copyList',
    data,
    method: 'post'
  })
}

/**
 * 普通员工查看发起列表
 */
export const myApprovalList = data => {
  return axios.request({
    url: URL_PREFIX + 'myApprovalList',
    data,
    method: 'post'
  })
}

/**
 * 当前拒绝申请
 */
export const overruled = data => {
  return axios.request({
    url: URL_PREFIX + 'overruled',
    data,
    method: 'post'
  })
}

/**
 * 撤回申请
 */
export const withdraw = id => {
  return axios.request({
    url: URL_PREFIX + `withdraw/${id}`,
    method: 'get'
  })
}

/**
 * 申请详情
 */
export const details = id => {
  return axios.request({
    url: URL_PREFIX + `details/${id}`,
    method: 'get'
  })
}

/**
 * 请假类型
 * 2019年4月22日 目前不允许自定义
 */
export const leaveType = () => {
  return axios.request({
    url: URL_PREFIX + 'leaveType',
    method: 'get'
  })
}
