import axios from '@/libs/api.request'

// 创建/更新
export const updateReceivablePayments = (data) => {
  return axios.request({
    url: 'api/receivablePayments/updateReceivablePayments',
    method: 'post',
    data
  })
}

// 查询
export const queryReceivablePayments = (data) => {
  return axios.request({
    url: 'api/receivablePayments/queryReceivablePayments',
    method: 'post',
    data
  })
}

export const batchReceivablePayments = (data) => {
  return axios.request({
    url: 'api/receivablePayments/batchReceivablePayments',
    method: 'post',
    data
  })
}

export const parameterReceivablePayments = (data) => {
  return axios.request({
    url: 'api/receivablePayments/parameterReceivablePayments',
    method: 'post',
    data
  })
}
