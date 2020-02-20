import axios from '@/libs/api.request'

// 创建/更新
export const updatePayablePayments = (data) => {
  return axios.request({
    url: 'api/payablePayments/updatePayablePayments',
    method: 'post',
    data
  })
}

// 查询
export const queryPayablePayments = (data) => {
  return axios.request({
    url: 'api/payablePayments/queryPayablePayments',
    method: 'post',
    data
  })
}

export const batchPayablePayments = (data) => {
  return axios.request({
    url: 'api/payablePayments/batchPayablePayments',
    method: 'post',
    data
  })
}

export const parameterPayablePayments = (data) => {
  return axios.request({
    url: 'api/payablePayments/parameterPayablePayments',
    method: 'post',
    data
  })
}
