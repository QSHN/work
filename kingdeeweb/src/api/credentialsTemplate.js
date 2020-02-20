import axios from '@/libs/api.request'

// 创建/更新
export const updateCredentialsTemplate = (data) => {
  return axios.request({
    url: 'api/credentialsTemplate/update',
    method: 'post',
    data
  })
}

// 查询
export const queryCredentialsTemplate = (data) => {
  return axios.request({
    url: 'api/credentialsTemplate/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteCredentialsTemplate = (data) => {
  return axios.request({
    url: 'api/credentialsTemplate/delete',
    method: 'delete',
    data
  })
}
