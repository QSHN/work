import axios from '@/libs/api.request'

// 创建/更新
export const updateCashFlowTable = (data) => {
  return axios.request({
    url: 'api/cashFlowTable/update',
    method: 'post',
    data
  })
}

// 查询
export const queryCashFlowTable = (data) => {
  return axios.request({
    url: 'api/cashFlowTable/query',
    method: 'post',
    data
  })
}
