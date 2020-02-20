import axios from '@/libs/api.request'

// POST /office/reimbursement 增加费用报销
// GET /office/reimbursement/copyToMe/{id} 阅读抄送信息
// POST /office/reimbursement/doApprove 审批
// POST /office/reimbursement/getApprove 获取我的审批
// POST /office/reimbursement/getCopyToMe 获取抄送给我的
// GET /office/reimbursement/getMine 获取我的报销
// DELETE /office/reimbursement/{id} 撤回
// GET /office/reimbursement/{id} 获取报销详情

export const addReimbursement = (data) => {
  return axios.request({
    url: '/office/reimbursement',
    method: 'post',
    data
  })
}

export const copyToMe = (id, params) => {
  return axios.request({
    url: '/office/reimbursement/copyToMe/' + id,
    method: 'get',
    params
  })
}

export const doApprove = (data) => {
  return axios.request({
    url: '/office/reimbursement/doApprove',
    method: 'post',
    data
  })
}

export const getApprove = (data) => {
  return axios.request({
    url: '/office/reimbursement/getApprove',
    method: 'post',
    data
  })
}

export const getCopyToMe = (data) => {
  return axios.request({
    url: '/office/reimbursement/getCopyToMe',
    method: 'post',
    data
  })
}

export const getMine = (params) => {
  return axios.request({
    url: '/office/reimbursement/getMine',
    method: 'get',
    params
  })
}

export const deleteReimbursement = (id) => {
  return axios.request({
    url: '/office/reimbursement/copyToMe/' + id,
    method: 'delete',
    params
  })
}

export const getReimbursement = (id, params) => {
  return axios.request({
    url: '/office/reimbursement/' + id,
    method: 'get',
    params
  })
}
