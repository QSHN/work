import axios from '@/libs/api.request'

// 创建/更新
export const updateCredentialsCache = (data) => {
  return axios.request({
    url: 'api/credentialsCache/updateCredentialsCache',
    method: 'post',
    data
  })
}

export const editCredentialsCache = (data) => {
  return axios.request({
    url: 'api/credentialsCache/editCredentialsCache',
    method: 'post',
    data
  })
}

// 查询
export const queryCredentialsCache = (data) => {
  return axios.request({
    url: 'api/credentialsCache/queryCredentialsCache',
    method: 'post',
    data
  })
}

// 批量
export const batchCredentialsCache = (data) => {
  return axios.request({
    url: 'api/credentialsCache/batchCredentialsCache',
    method: 'post',
    data
  })
}
