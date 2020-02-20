import axios from '@/libs/api.request'

// 创建/更新
export const updatePayableCollection = (data) => {
  return axios.request({
    url: 'api/payableCollection/updatePayableCollection',
    method: 'post',
    data
  })
}

// 查询
export const queryPayableCollection = (data) => {
  return axios.request({
    url: 'api/payableCollection/queryPayableCollection',
    method: 'post',
    data
  })
}

export const batchPayableCollection = (data) => {
  return axios.request({
    url: 'api/payableCollection/batchPayableCollection',
    method: 'post',
    data
  })
}

export const parameterPayableCollection = (data) => {
  return axios.request({
    url: 'api/payableCollection/parameterPayableCollection',
    method: 'post',
    data
  })
}
