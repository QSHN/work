import axios from '@/libs/api.request'

// 创建/更新
export const updateReceivableCollection = (data) => {
  return axios.request({
    url: 'api/receivableCollection/updateReceivableCollection',
    method: 'post',
    data
  })
}

// 查询
export const queryReceivableCollection = (data) => {
  return axios.request({
    url: 'api/receivableCollection/queryReceivableCollection',
    method: 'post',
    data
  })
}

export const batchReceivableCollection = (data) => {
  return axios.request({
    url: 'api/receivableCollection/batchReceivableCollection',
    method: 'post',
    data
  })
}

export const parameterReceivableCollection = (data) => {
  return axios.request({
    url: 'api/receivableCollection/parameterReceivableCollection',
    method: 'post',
    data
  })
}
