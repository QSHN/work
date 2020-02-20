import axios from '@/libs/api.request'

// 创建/更新
export const updatePayableOther = (data) => {
  return axios.request({
    url: 'api/payableOther/updatePayableOther',
    method: 'post',
    data
  })
}

// 查询
export const queryPayableOther = (data) => {
  return axios.request({
    url: 'api/payableOther/queryPayableOther',
    method: 'post',
    data
  })
}

export const batchPayableOther = (data) => {
  return axios.request({
    url: 'api/payableOther/batchPayableOther',
    method: 'post',
    data
  })
}

export const parameterPayableOther = (data) => {
  return axios.request({
    url: 'api/payableOther/parameterPayableOther',
    method: 'post',
    data
  })
}
