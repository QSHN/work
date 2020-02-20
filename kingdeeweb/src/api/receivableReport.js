import axios from '@/libs/api.request'

// 查询
export const queryReceivableReport = (data) => {
  return axios.request({
    url: 'api/receivableReport/queryReceivableReport',
    method: 'post',
    data
  })
}

export const queryAllReceivableReport = (data) => {
  return axios.request({
    url: 'api/receivableReport/queryAllReceivableReport',
    method: 'post',
    data
  })
}
