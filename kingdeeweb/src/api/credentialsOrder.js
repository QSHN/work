import axios from '@/libs/api.request'

// 创建/更新
export const updateCredentialsOrder = (data) => {
  return axios.request({
    url: 'api/credentialsOrder/updateCredentialsOrder',
    method: 'post',
    data
  })
}

// 查询
export const queryCredentialsOrder = (data) => {
  return axios.request({
    url: 'api/credentialsOrder/queryCredentialsOrder',
    method: 'post',
    data
  })
}

// 批量
export const batchCredentialsOrder = (data) => {
  return axios.request({
    url: 'api/credentialsOrder/batchCredentialsOrder',
    method: 'post',
    data
  })
}
