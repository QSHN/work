import axios from '@/libs/api.request'

// 创建/更新
export const updateReceivableOther = (data) => {
  return axios.request({
    url: 'api/receivableOther/updateReceivableOther',
    method: 'post',
    data
  })
}

// 查询
export const queryReceivableOther = (data) => {
  return axios.request({
    url: 'api/receivableOther/queryReceivableOther',
    method: 'post',
    data
  })
}

export const batchReceivableOther = (data) => {
  return axios.request({
    url: 'api/receivableOther/batchReceivableOther',
    method: 'post',
    data
  })
}

export const parameterReceivableOther = (data) => {
  return axios.request({
    url: 'api/receivableOther/parameterReceivableOther',
    method: 'post',
    data
  })
}
