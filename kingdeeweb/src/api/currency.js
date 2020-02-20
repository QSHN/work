import axios from '@/libs/api.request'

// 创建/更新
export const currencyUpdate = (data) => {
  return axios.request({
    url: 'api/currency/currencyUpdate',
    method: 'post',
    data
  })
}

// 查询
export const currencyQuery = (data) => {
  return axios.request({
    url: 'api/currency/currencyQuery',
    method: 'post',
    data
  })
}

export const batchCurrency = (data) => {
  return axios.request({
    url: 'api/currency/batchCurrency',
    method: 'delete',
    data
  })
}
