import axios from '@/libs/api.request'

// 创建/更新
export const updatePayableRefund = (data) => {
  return axios.request({
    url: 'api/payableRefund/updatePayableRefund',
    method: 'post',
    data
  })
}

// 查询
export const queryPayableRefund = (data) => {
  return axios.request({
    url: 'api/payableRefund/queryPayableRefund',
    method: 'post',
    data
  })
}

export const batchPayableRefund = (data) => {
  return axios.request({
    url: 'api/payableRefund/batchPayableRefund',
    method: 'post',
    data
  })
}

export const parameterPayableRefund = (data) => {
  return axios.request({
    url: 'api/payableRefund/parameterPayableRefund',
    method: 'post',
    data
  })
}
