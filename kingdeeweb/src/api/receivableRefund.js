import axios from '@/libs/api.request'

// 创建/更新
export const updateReceivableRefund = (data) => {
  return axios.request({
    url: 'api/receivableRefund/updateReceivableRefund',
    method: 'post',
    data
  })
}

// 查询
export const queryReceivableRefund = (data) => {
  return axios.request({
    url: 'api/receivableRefund/queryReceivableRefund',
    method: 'post',
    data
  })
}

export const batchReceivableRefund = (data) => {
  return axios.request({
    url: 'api/receivableRefund/batchReceivableRefund',
    method: 'post',
    data
  })
}

export const parameterReceivableRefund = (data) => {
  return axios.request({
    url: 'api/receivableRefund/parameterReceivableRefund',
    method: 'post',
    data
  })
}
