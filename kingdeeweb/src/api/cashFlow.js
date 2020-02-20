import axios from '@/libs/api.request'

// 创建/更新
export const updateCashFlow = (data) => {
  return axios.request({
    url: 'api/cashFlow/update',
    method: 'post',
    data
  })
}

// 查询
export const queryCashFlow = (data) => {
  return axios.request({
    url: 'api/cashFlow/query',
    method: 'post',
    data
  })
}

// 删除
export const deleteCashFlow = (data) => {
  return axios.request({
    url: 'api/cashFlow/delete',
    method: 'delete',
    data
  })
}
