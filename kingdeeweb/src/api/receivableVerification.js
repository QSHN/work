import axios from '@/libs/api.request'

// 创建/更新
export const updateReceivableVerification = (data) => {
  return axios.request({
    url: 'api/receivableVerification/updateReceivableVerification',
    method: 'post',
    data
  })
}

// 查询
export const queryReceivableVerification = (data) => {
  return axios.request({
    url: 'api/receivableVerification/queryReceivableVerification',
    method: 'post',
    data
  })
}

export const batchReceivableVerification = (data) => {
  return axios.request({
    url: 'api/receivableVerification/batchReceivableVerification',
    method: 'post',
    data
  })
}

export const parameterReceivableVerification = (data) => {
  return axios.request({
    url: 'api/receivableVerification/parameterReceivableVerification',
    method: 'post',
    data
  })
}
