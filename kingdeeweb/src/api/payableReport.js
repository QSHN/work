import axios from '@/libs/api.request'

// 查询
export const queryPayableReport = (data) => {
  return axios.request({
    url: 'api/payableReport/queryPayableReport',
    method: 'post',
    data
  })
}

export const queryAllPayableReport = (data) => {
  return axios.request({
    url: 'api/payableReport/queryAllPayableReport',
    method: 'post',
    data
  })
}
